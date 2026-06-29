import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { PRIVATE_CHALLENGES } from '../../src/challengeData';

const SECRET = process.env.SESSION_SECRET ?? 'dev-secret-change-in-prod';

type SessionData = { challengeId: string; userId: string; createdAt: number; expiresAt: number };

function decodeToken(token: string): SessionData | null {
  try {
    const dot = token.lastIndexOf('.');
    if (dot < 0) return null;
    const payload = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
    if (sig.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    return JSON.parse(Buffer.from(payload, 'base64url').toString()) as SessionData;
  } catch {
    return null;
  }
}

function normalizeEdge(e: [string, string]) { return [...e].sort().join('::'); }

function edgesMatch(submitted: [string, string][], solution: [string, string][]) {
  if (submitted.length !== solution.length) return false;
  const s = new Set(submitted.map(normalizeEdge));
  const sol = new Set(solution.map(normalizeEdge));
  if (s.size !== sol.size) return false;
  for (const e of sol) if (!s.has(e)) return false;
  return true;
}

let aiClient: GoogleGenAI | null = null;
function getAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.trim() === '' || key === 'MY_GEMINI_API_KEY') return null;
  if (!aiClient) { try { aiClient = new GoogleGenAI({ apiKey: key }); } catch { return null; } }
  return aiClient;
}

async function buildFeedback(name: string, fallback: string, lang: 'en' | 'pt') {
  const ai = getAI();
  if (!ai) return fallback;
  try {
    const isPt = lang === 'pt';
    const r = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: isPt
        ? `O utilizador resolveu a constelacao ${name}. Gera feedback educativo em duas frases.`
        : `The user solved constellation ${name}. Generate educational feedback in two sentences.`,
    });
    return r.text?.trim() || fallback;
  } catch { return fallback; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId, submittedEdges, lang = 'en' } = req.body || {};

  const session = decodeToken(String(sessionId || ''));
  if (!session) {
    return res.status(404).json({ success: false, status: 'expired', attemptsRemaining: 0, hint: 'Invalid or expired session.' });
  }

  if (Date.now() > session.expiresAt) {
    return res.status(200).json({ success: false, status: 'expired', attemptsRemaining: 0, hint: lang === 'pt' ? 'Sessao expirada.' : 'Session expired.' });
  }

  const challenge = PRIVATE_CHALLENGES.find((c) => c.id === session.challengeId);
  if (!challenge) return res.status(500).json({ success: false, status: 'failed', attemptsRemaining: 0 });

  const safeEdges = Array.isArray(submittedEdges)
    ? submittedEdges.filter((e: unknown): e is [string, string] => Array.isArray(e) && e.length === 2 && typeof e[0] === 'string' && typeof e[1] === 'string')
    : [];

  if (edgesMatch(safeEdges, challenge.solutionEdges)) {
    const timeSpent = Math.round((Date.now() - session.createdAt) / 1000);
    const fallback = lang === 'pt' ? challenge.successFeedbackPt : challenge.successFeedbackEn;
    const feedback = await buildFeedback(challenge.name, fallback, lang === 'pt' ? 'pt' : 'en');
    return res.status(200).json({ success: true, status: 'success', attemptsRemaining: 0, timeSpent, feedback });
  }

  return res.status(200).json({
    success: false,
    status: 'pending',
    attemptsRemaining: 2,
    hint: lang === 'pt' ? challenge.hintPt : challenge.hintEn,
  });
}
