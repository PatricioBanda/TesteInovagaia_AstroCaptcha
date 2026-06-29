import { describe, it, expect } from 'vitest';
import { CONSTELLATIONS } from '../constellations';

describe('CONSTELLATIONS data', () => {
  it('exports a non-empty array', () => {
    expect(CONSTELLATIONS.length).toBeGreaterThan(0);
  });

  it('every constellation has required fields', () => {
    for (const c of CONSTELLATIONS) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(Array.isArray(c.stars)).toBe(true);
      expect(Array.isArray(c.connections)).toBe(true);
      expect(c.hintPt).toBeTruthy();
      expect(c.hintEn).toBeTruthy();
      expect(c.insightStatic).toBeTruthy();
    }
  });

  it('every star has coordinates within 0–100', () => {
    for (const c of CONSTELLATIONS) {
      for (const star of c.stars) {
        expect(star.x).toBeGreaterThanOrEqual(0);
        expect(star.x).toBeLessThanOrEqual(100);
        expect(star.y).toBeGreaterThanOrEqual(0);
        expect(star.y).toBeLessThanOrEqual(100);
      }
    }
  });

  it('every connection references valid star IDs', () => {
    for (const c of CONSTELLATIONS) {
      const starIds = new Set(c.stars.map((s) => s.id));
      for (const [a, b] of c.connections) {
        expect(starIds.has(a), `Unknown star "${a}" in ${c.id}`).toBe(true);
        expect(starIds.has(b), `Unknown star "${b}" in ${c.id}`).toBe(true);
      }
    }
  });

  it('contains Orion, Cassiopeia, and Ursa Major', () => {
    const ids = CONSTELLATIONS.map((c) => c.id);
    expect(ids).toContain('orion');
    expect(ids).toContain('cassiopeia');
    expect(ids).toContain('ursa_major');
  });
});
