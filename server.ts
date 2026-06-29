import crypto from 'crypto';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { PRIVATE_CHALLENGES, toPublicChallenge } from './src/challengeData';

dotenv.config();

type CaptchaStatus = 'pending' | 'failed' | 'success' | 'expired';

type CaptchaSession = {
  id: string;
  challengeId: string;
  userId: string;
  username: string;
  attempts: number;
  maxAttempts: number;
  status: CaptchaStatus;
  createdAt: number;
  expiresAt: number;
  completedAt?: number;
};

const CAPTCHA_SECONDS = 45;
const MAX_ATTEMPTS = 3;
const sessions = new Map<string, CaptchaSession>();
const lastChallengeByUser = new Map<string, string>();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }

  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
    } catch (err) {
      console.error('Failed to initialize Google GenAI client:', err);
      return null;
    }
  }

  return aiClient;
}

function normalizeEdge(edge: [string, string]) {
  return [...edge].sort().join('::');
}

function edgesMatch(submittedEdges: [string, string][], solutionEdges: [string, string][]) {
  if (submittedEdges.length !== solutionEdges.length) return false;

  const submitted = new Set(submittedEdges.map(normalizeEdge));
  const solution = new Set(solutionEdges.map(normalizeEdge));

  if (submitted.size !== solution.size) return false;
  for (const edge of solution) {
    if (!submitted.has(edge)) return false;
  }
  return true;
}

function randomChallenge(previousChallengeId?: string) {
  const available = previousChallengeId
    ? PRIVATE_CHALLENGES.filter((challenge) => challenge.id !== previousChallengeId)
    : PRIVATE_CHALLENGES;
  const pool = available.length > 0 ? available : PRIVATE_CHALLENGES;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

async function buildFeedback(challengeName: string, fallback: string, lang: 'en' | 'pt') {
  const ai = getGeminiClient();
  if (!ai) return fallback;

  try {
    const isPt = lang === 'pt';
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: isPt
        ? 'O utilizador resolveu corretamente a constelacao ' + challengeName + '. Gera um feedback educativo e motivador em no maximo duas frases.'
        : 'The user correctly solved the constellation ' + challengeName + '. Generate educational, motivating feedback in no more than two sentences.',
      config: {
        temperature: 0.7,
        systemInstruction: isPt
          ? 'Es o mentor educativo da AstroCAPTCHA. Celebra conhecimento cientifico sem falar de premios ou apostas.'
          : 'You are the AstroCAPTCHA educational mentor. Celebrate scientific knowledge without mentioning prizes or gambling.'
      }
    });

    return response.text?.trim() || fallback;
  } catch (err) {
    console.error('Feedback generation failed, using fallback:', err);
    return fallback;
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json());

  app.post('/api/captcha/generate', (req, res) => {
    const userId = String(req.body?.userId || 'demo-user');
    const username = String(req.body?.username || 'Voyager');
    const challenge = randomChallenge(lastChallengeByUser.get(userId));
    lastChallengeByUser.set(userId, challenge.id);
    const now = Date.now();
    const session: CaptchaSession = {
      id: crypto.randomUUID(),
      challengeId: challenge.id,
      userId,
      username,
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      status: 'pending',
      createdAt: now,
      expiresAt: now + CAPTCHA_SECONDS * 1000
    };

    sessions.set(session.id, session);

    res.json({
      sessionId: session.id,
      expiresAt: new Date(session.expiresAt).toISOString(),
      attemptsRemaining: session.maxAttempts - session.attempts,
      challenge: toPublicChallenge(challenge)
    });
  });

  app.post('/api/captcha/verify', async (req, res) => {
    const { sessionId, submittedEdges, lang = 'en' } = req.body || {};
    const session = sessions.get(String(sessionId));

    if (!session) {
      res.status(404).json({ success: false, status: 'expired', attemptsRemaining: 0, hint: 'Challenge session not found. Generate a new challenge.' });
      return;
    }

    const challenge = PRIVATE_CHALLENGES.find((item) => item.id === session.challengeId);
    if (!challenge) {
      res.status(500).json({ success: false, status: 'failed', attemptsRemaining: 0, hint: 'Challenge data is unavailable.' });
      return;
    }

    if (Date.now() > session.expiresAt) {
      session.status = 'expired';
      res.json({
        success: false,
        status: 'expired',
        attemptsRemaining: Math.max(0, session.maxAttempts - session.attempts),
        hint: lang === 'pt' ? 'A sessao expirou. Gera um novo desafio.' : 'The session expired. Generate a new challenge.'
      });
      return;
    }

    if (session.status !== 'pending') {
      res.json({
        success: session.status === 'success',
        status: session.status,
        attemptsRemaining: Math.max(0, session.maxAttempts - session.attempts)
      });
      return;
    }

    const safeEdges = Array.isArray(submittedEdges)
      ? submittedEdges.filter((edge): edge is [string, string] => Array.isArray(edge) && edge.length === 2 && typeof edge[0] === 'string' && typeof edge[1] === 'string')
      : [];

    session.attempts += 1;
    const solved = edgesMatch(safeEdges, challenge.solutionEdges);
    const attemptsRemaining = Math.max(0, session.maxAttempts - session.attempts);

    if (solved) {
      session.status = 'success';
      session.completedAt = Date.now();
      const fallback = lang === 'pt' ? challenge.successFeedbackPt : challenge.successFeedbackEn;
      const feedback = await buildFeedback(challenge.name, fallback, lang === 'pt' ? 'pt' : 'en');

      res.json({
        success: true,
        status: 'success',
        attemptsRemaining,
        timeSpent: Math.round((session.completedAt - session.createdAt) / 1000),
        feedback
      });
      return;
    }

    if (attemptsRemaining <= 0) {
      session.status = 'failed';
    }

    res.json({
      success: false,
      status: session.status,
      attemptsRemaining,
      hint: lang === 'pt' ? challenge.hintPt : challenge.hintEn
    });
  });

  app.post('/api/insight', async (req, res) => {
    const { constellation, timeSpent, username, lang } = req.body;
    if (!constellation) {
      res.status(400).json({ error: 'Constellation name is required.' });
      return;
    }

    const challenge = PRIVATE_CHALLENGES.find((item) => item.name === constellation);
    const fallback = lang === 'pt' ? challenge?.successFeedbackPt : challenge?.successFeedbackEn;
    const insight = await buildFeedback(String(constellation), fallback || 'Constellations are useful patterns for learning the night sky.', lang === 'pt' ? 'pt' : 'en');
    res.json({ insight, source: getGeminiClient() ? 'gemini' : 'local' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log('AstroCAPTCHA POC running at http://localhost:' + PORT);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});


