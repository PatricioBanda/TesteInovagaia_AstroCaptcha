import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { PRIVATE_CHALLENGES } from '../src/challengeData';

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
        ? `Gera um facto interessante sobre a constelacao ${name} em duas frases.`
        : `Generate an interesting fact about constellation ${name} in two sentences.`,
    });
    return r.text?.trim() || fallback;
  } catch { return fallback; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { constellation, lang } = req.body || {};
  if (!constellation) return res.status(400).json({ error: 'Constellation name is required.' });

  const challenge = PRIVATE_CHALLENGES.find((c) => c.name === constellation);
  const fallback = lang === 'pt' ? challenge?.successFeedbackPt : challenge?.successFeedbackEn;
  const insight = await buildFeedback(String(constellation), fallback ?? 'Constellations are useful patterns for learning the night sky.', lang === 'pt' ? 'pt' : 'en');

  return res.status(200).json({ insight, source: getAI() ? 'gemini' : 'local' });
}
