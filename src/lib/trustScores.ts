import { TrustScores, TrustLevel } from '../store/useAuthStore';

export function calculateNewTrustScores(
  currentLevel: TrustLevel,
  currentScores: TrustScores,
  locationVerified: boolean
): { trust_level: TrustLevel; trust_scores: TrustScores } {
  let newLevel = currentLevel;
  let locationScore = currentScores.location;

  if (locationVerified) {
    newLevel = Math.max(newLevel, 2) as TrustLevel;
    locationScore = 80;
  }

  const newScores = {
    ...currentScores,
    location: locationScore,
    overall: currentScores.identity + locationScore + currentScores.community
  };

  return { trust_level: newLevel, trust_scores: newScores };
}
