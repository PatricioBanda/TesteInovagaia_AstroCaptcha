import crypto from 'crypto';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { PRIVATE_CHALLENGES, toPublicChallenge } from '../src/challengeData';

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

// In-memory store — works within a warm serverless instance (fine for POC).
// For production, replace with Vercel KV or another external store.
const sessions = new Map<string, CaptchaSession>();
const lastChallengeByUser = new Map<string, string>();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') return null;
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({ apiKey });
    } catch {
      return null;
    }
  }
  return aiClient;
}

function normalizeEdge(edge: [string, string]) {
  return [...edge].sort().join('::');
}

function edgesMatch(submitted: [string, string][], solution: [string, string][]) {
  if (submitted.length !== solution.length) return false;
  const s = new Set(submitted.map(normalizeEdge));
  const sol = new Set(solution.map(normalizeEdge));
  if (s.size !== sol.size) return false;
  for (const e of sol) if (!s.has(e)) return false;
  return true;
}

function randomChallenge(previousId?: string) {
  const pool = previousId
    ? PRIVATE_CHALLENGES.filter((c) => c.id !== previousId)
    : PRIVATE_CHALLENGES;
  const available = pool.length > 0 ? pool : PRIVATE_CHALLENGES;
  return available[Math.floor(Math.random() * available.length)];
}

async function buildFeedback(name: string, fallback: string, lang: 'en' | 'pt') {
  const ai = getGeminiClient();
  if (!ai) return fallback;
  try {
    const isPt = lang === 'pt';
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: isPt
        ? `O utilizador resolveu corretamente a constelacao ${name}. Gera um feedback educativo e motivador em no maximo duas frases.`
        : `The user correctly solved the constellation ${name}. Generate educational, motivating feedback in no more than two sentences.`,
      config: {
        temperature: 0.7,
        systemInstruction: isPt
          ? 'Es o mentor educativo da AstroCAPTCHA. Celebra conhecimento cientifico.'
          : 'You are the AstroCAPTCHA educational mentor. Celebrate scientific knowledge.',
      },
    });
    return response.text?.trim() || fallback;
  } catch {
    return fallback;
  }
}

const app = express();

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('*', (_req, res) => res.sendStatus(204));

app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

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
    expiresAt: now + CAPTCHA_SECONDS * 1000,
  };
  sessions.set(session.id, session);
  res.json({
    sessionId: session.id,
    expiresAt: new Date(session.expiresAt).toISOString(),
    attemptsRemaining: session.maxAttempts,
    challenge: toPublicChallenge(challenge),
  });
});

app.post('/api/captcha/verify', async (req, res) => {
  const { sessionId, submittedEdges, lang = 'en' } = req.body || {};
  const session = sessions.get(String(sessionId));

  if (!session) {
    res.status(404).json({ success: false, status: 'expired', attemptsRemaining: 0, hint: 'Session not found. Generate a new challenge.' });
    return;
  }

  const challenge = PRIVATE_CHALLENGES.find((c) => c.id === session.challengeId);
  if (!challenge) {
    res.status(500).json({ success: false, status: 'failed', attemptsRemaining: 0 });
    return;
  }

  if (Date.now() > session.expiresAt) {
    session.status = 'expired';
    res.json({ success: false, status: 'expired', attemptsRemaining: 0, hint: lang === 'pt' ? 'Sessao expirada.' : 'Session expired.' });
    return;
  }

  if (session.status !== 'pending') {
    res.json({ success: session.status === 'success', status: session.status, attemptsRemaining: Math.max(0, session.maxAttempts - session.attempts) });
    return;
  }

  const safeEdges = Array.isArray(submittedEdges)
    ? submittedEdges.filter((e): e is [string, string] => Array.isArray(e) && e.length === 2 && typeof e[0] === 'string' && typeof e[1] === 'string')
    : [];

  session.attempts += 1;
  const solved = edgesMatch(safeEdges, challenge.solutionEdges);
  const attemptsRemaining = Math.max(0, session.maxAttempts - session.attempts);

  if (solved) {
    session.status = 'success';
    session.completedAt = Date.now();
    const fallback = lang === 'pt' ? challenge.successFeedbackPt : challenge.successFeedbackEn;
    const feedback = await buildFeedback(challenge.name, fallback, lang === 'pt' ? 'pt' : 'en');
    res.json({ success: true, status: 'success', attemptsRemaining, timeSpent: Math.round((session.completedAt - session.createdAt) / 1000), feedback });
    return;
  }

  if (attemptsRemaining <= 0) session.status = 'failed';

  res.json({ success: false, status: session.status, attemptsRemaining, hint: lang === 'pt' ? challenge.hintPt : challenge.hintEn });
});

app.post('/api/insight', async (req, res) => {
  const { constellation, lang } = req.body || {};
  if (!constellation) {
    res.status(400).json({ error: 'Constellation name is required.' });
    return;
  }
  const challenge = PRIVATE_CHALLENGES.find((c) => c.name === constellation);
  const fallback = lang === 'pt' ? challenge?.successFeedbackPt : challenge?.successFeedbackEn;
  const insight = await buildFeedback(String(constellation), fallback || 'Constellations are useful patterns for learning the night sky.', lang === 'pt' ? 'pt' : 'en');
  res.json({ insight, source: getGeminiClient() ? 'gemini' : 'local' });
});

export default app;
