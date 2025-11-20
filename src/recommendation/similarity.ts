import type {
  RecommendationResult,
  SimilarityVector,
  SportSection,
  UserProfile,
  VectorKey,
} from "../types.js";
import type { Contribution, NormalizedVector } from "./internalTypes.js";
import { isContactCompatible } from "./filters.js";
import { buildReasons } from "./reasonBuilder.js";
import {
  buildSectionVector,
  buildUserVector,
  normalizeVector,
  round,
} from "./vectorSpaces.js";

export function computeCosineSimilarity(
  userVector: NormalizedVector,
  sectionVector: NormalizedVector
): { similarity: number; contributions: Contribution[] } {
  const keys = new Set([
    ...Object.keys(userVector),
    ...Object.keys(sectionVector),
  ]);
  let dot = 0;
  const contributions: Contribution[] = [];
  keys.forEach((key) => {
    const a = userVector[key] ?? 0;
    const b = sectionVector[key] ?? 0;
    const value = a * b;
    dot += value;
    if (value > 0) {
      contributions.push({ dimension: key as VectorKey, weight: value });
    }
  });
  contributions.sort((a, b) => b.weight - a.weight);
  return { similarity: dot, contributions };
}

function scoreSection(
  section: SportSection,
  profile: UserProfile,
  userVector: SimilarityVector,
  normalizedUser: NormalizedVector,
  options: { includeZero?: boolean } = {}
): RecommendationResult | null {
  if (!isContactCompatible(section, profile)) {
    return null;
  }

  const sectionVector = buildSectionVector(section);
  const normalizedSection = normalizeVector(sectionVector);
  if (!normalizedSection) {
    return null;
  }

  const { similarity, contributions } = computeCosineSimilarity(
    normalizedUser,
    normalizedSection
  );

  if (!options.includeZero && similarity <= 0) {
    return null;
  }

  const reasons = buildReasons(
    contributions,
    profile,
    section,
    userVector,
    sectionVector
  );

  return {
    section,
    score: round(similarity),
    reasons,
    vector: sectionVector,
  };
}

export function scoreSections(
  sections: SportSection[],
  profile: UserProfile,
  includeZero = false
): RecommendationResult[] {
  const userVector = buildUserVector(profile);
  const normalizedUser = normalizeVector(userVector);
  if (!normalizedUser) {
    return [];
  }

  return sections
    .map((section) =>
      scoreSection(section, profile, userVector, normalizedUser, {
        includeZero,
      })
    )
    .filter((result): result is RecommendationResult => result !== null)
    .sort((a, b) => b.score - a.score);
}
