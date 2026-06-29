import { describe, it, expect } from 'vitest';
import { PRIVATE_CHALLENGES, toPublicChallenge } from '../challengeData';

describe('PRIVATE_CHALLENGES data', () => {
  it('exports a non-empty array', () => {
    expect(PRIVATE_CHALLENGES.length).toBeGreaterThan(0);
  });

  it('every challenge has required fields', () => {
    for (const c of PRIVATE_CHALLENGES) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(['easy', 'medium', 'hard']).toContain(c.difficulty);
      expect(Array.isArray(c.stars)).toBe(true);
      expect(c.stars.length).toBeGreaterThan(0);
      expect(Array.isArray(c.solutionEdges)).toBe(true);
      expect(c.solutionEdges.length).toBeGreaterThan(0);
      expect(c.hintPt).toBeTruthy();
      expect(c.hintEn).toBeTruthy();
      expect(c.successFeedbackPt).toBeTruthy();
      expect(c.successFeedbackEn).toBeTruthy();
    }
  });

  it('every solutionEdge references valid star IDs', () => {
    for (const c of PRIVATE_CHALLENGES) {
      const starIds = new Set(c.stars.map((s) => s.id));
      for (const [a, b] of c.solutionEdges) {
        expect(starIds.has(a), `Unknown star "${a}" in challenge ${c.id}`).toBe(true);
        expect(starIds.has(b), `Unknown star "${b}" in challenge ${c.id}`).toBe(true);
      }
    }
  });

  it('every star has coordinates within 0–100', () => {
    for (const c of PRIVATE_CHALLENGES) {
      for (const star of c.stars) {
        expect(star.x).toBeGreaterThanOrEqual(0);
        expect(star.x).toBeLessThanOrEqual(100);
        expect(star.y).toBeGreaterThanOrEqual(0);
        expect(star.y).toBeLessThanOrEqual(100);
      }
    }
  });

  it('all challenge IDs are unique', () => {
    const ids = PRIVATE_CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('toPublicChallenge', () => {
  it('strips solutionEdges and successFeedback fields', () => {
    const priv = PRIVATE_CHALLENGES[0];
    const pub = toPublicChallenge(priv);
    expect((pub as Record<string, unknown>).solutionEdges).toBeUndefined();
    expect((pub as Record<string, unknown>).successFeedbackPt).toBeUndefined();
    expect((pub as Record<string, unknown>).successFeedbackEn).toBeUndefined();
  });

  it('exposes previewEdges equal to the original solutionEdges', () => {
    const priv = PRIVATE_CHALLENGES[0];
    const pub = toPublicChallenge(priv);
    expect(pub.previewEdges).toEqual(priv.solutionEdges);
  });

  it('retains id, name, difficulty, stars, hints', () => {
    const priv = PRIVATE_CHALLENGES[0];
    const pub = toPublicChallenge(priv);
    expect(pub.id).toBe(priv.id);
    expect(pub.name).toBe(priv.name);
    expect(pub.difficulty).toBe(priv.difficulty);
    expect(pub.stars).toEqual(priv.stars);
    expect(pub.hintPt).toBe(priv.hintPt);
    expect(pub.hintEn).toBe(priv.hintEn);
  });
});
