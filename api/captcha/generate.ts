import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { PRIVATE_CHALLENGES, toPublicChallenge } from '../../src/challengeData';

const SECRET = process.env.SESSION_SECRET ?? 'dev-secret-change-in-prod';
const CAPTCHA_SECONDS = 45;
const MAX_ATTEMPTS = 3;

function createToken(data: object): string {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function randomChallenge() {
  return PRIVATE_CHALLENGES[Math.floor(Math.random() * PRIVATE_CHALLENGES.length)];
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const userId = String(req.body?.userId || 'demo-user');
  const challenge = randomChallenge();
  const now = Date.now();
  const expiresAt = now + CAPTCHA_SECONDS * 1000;

  const sessionId = createToken({ challengeId: challenge.id, userId, createdAt: now, expiresAt });

  return res.status(200).json({
    sessionId,
    expiresAt: new Date(expiresAt).toISOString(),
    attemptsRemaining: MAX_ATTEMPTS,
    challenge: toPublicChallenge(challenge),
  });
}
