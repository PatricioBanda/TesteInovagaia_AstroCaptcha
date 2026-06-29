# AstroCAPTCHA Proof of Concept

This project is a working AstroCAPTCHA proof of concept built with Vite, React, TypeScript, and a small Express server.

## Current POC Flow

- Landing page explains the concept.
- Local login/register creates a demo user session in `localStorage`.
- The challenge page calls `POST /api/captcha/generate`.
- The server creates a timed CAPTCHA session and returns only safe challenge fields: `id`, `name`, `difficulty`, `stars`, `hintPt`, and `hintEn`.
- The browser lets the user connect stars and submits only drawn edges to `POST /api/captcha/verify`.
- The server compares those edges with private solution data.
- Wrong answers reduce attempts and return a hint.
- After too many failures or timeout, the user must generate a new challenge.
- Correct answers redirect to a separate success page with user number, constellation, time, attempts, and feedback.

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Verification

```bash
npm run lint
npm run build
```

## POC Notes

This is not yet the final PRD architecture. It still uses local demo auth and in-memory CAPTCHA sessions. The next production step is to migrate the app to the PRD stack:

- Next.js App Router
- Supabase Auth
- Supabase Postgres
- RLS policies
- persistent `profiles`, `captcha_sessions`, `attempts`, `challenges`, and private `challenge_solutions`
- Groq API for hints and feedback with static fallback
- Vercel deployment
