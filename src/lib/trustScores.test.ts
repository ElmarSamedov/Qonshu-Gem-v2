import { describe, it, expect } from 'vitest';
import { calculateNewTrustScores } from './trustScores';

describe('calculateNewTrustScores', () => {
  it('updates scores when location is verified', () => {
    const currentLevel = 1;
    const currentScores = { identity: 40, location: 0, community: 10, overall: 50 };
    const { trust_level, trust_scores } = calculateNewTrustScores(currentLevel, currentScores, true);
    
    expect(trust_level).toBeGreaterThanOrEqual(2);
    expect(trust_scores.location).toBe(80);
    expect(trust_scores.overall).toBe(130);
  });

  it('maintains scores when location is not verified', () => {
    const currentLevel = 1;
    const currentScores = { identity: 40, location: 0, community: 10, overall: 50 };
    const { trust_level, trust_scores } = calculateNewTrustScores(currentLevel, currentScores, false);
    
    expect(trust_level).toBe(1);
    expect(trust_scores.location).toBe(0);
    expect(trust_scores.overall).toBe(50);
  });
});
