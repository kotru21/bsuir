import { sportSections } from "./data/sections.js";
import type {
  RecommendationResult,
  SportSection,
  UserProfile,
  GoalTag,
  TrainingFormat,
  RecommendationReason,
} from "./types.js";

const fitnessWeights: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

function formatMatches(
  section: SportSection,
  preferred: TrainingFormat[]
): boolean {
  if (preferred.length === 0) {
    return true;
  }
  if (preferred.includes("mixed")) {
    return true;
  }
  return preferred.includes(section.format);
}

function contactAllowed(section: SportSection, avoidContact: boolean): boolean {
  if (!avoidContact) {
    return true;
  }
  return section.contactLevel === "nonContact";
}

function buildReasonCodes(
  section: SportSection,
  profile: UserProfile,
  matchedFocus: GoalTag[],
  formatMatch: boolean,
  fitnessDiff: number,
  score: number
): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];

  if (matchedFocus.length) {
    reasons.push({ kind: "goal-match", tags: matchedFocus });
  }

  if (profile.preferredFormats.length > 0) {
    if (formatMatch) {
      reasons.push({
        kind: "format-aligned",
        format: section.format,
        preferred: profile.preferredFormats,
      });
    } else {
      reasons.push({
        kind: "format-mismatch",
        format: section.format,
        preferred: profile.preferredFormats,
      });
    }
  }

  const fitnessReasonBase = {
    profileLevel: profile.fitnessLevel,
    intensity: section.intensity,
  } as const;

  if (fitnessDiff === 0) {
    reasons.push({ kind: "fitness-balanced", ...fitnessReasonBase });
  } else if (fitnessDiff === 1) {
    reasons.push({ kind: "fitness-progressive", ...fitnessReasonBase });
  } else {
    reasons.push({ kind: "fitness-gap", ...fitnessReasonBase });
  }

  if (
    profile.interestedInCompetition &&
    section.focus.includes("competition")
  ) {
    reasons.push({ kind: "competition-path" });
  }

  if (score > 0 && section.extraBenefits?.length) {
    reasons.push({
      kind: "extra-benefits",
      benefits: section.extraBenefits.slice(0, 2),
    });
  }

  return reasons;
}

function computeScore(
  section: SportSection,
  profile: UserProfile
): RecommendationResult | null {
  if (!contactAllowed(section, profile.avoidContact)) {
    return null;
  }

  let score = 0;
  const matchedFocus = section.focus.filter((tag) =>
    profile.desiredGoals.includes(tag)
  );
  score += matchedFocus.length * 3;

  const formatMatch = formatMatches(section, profile.preferredFormats);

  if (formatMatch) {
    score += 2;
  } else {
    score -= 1;
  }

  const fitnessDiff = Math.abs(
    fitnessWeights[profile.fitnessLevel] - fitnessWeights[section.intensity]
  );
  if (fitnessDiff === 0) {
    score += 2;
  } else if (fitnessDiff === 1) {
    score += 1;
  } else {
    score -= 2;
  }

  if (
    profile.interestedInCompetition &&
    section.focus.includes("competition")
  ) {
    score += 2;
  }

  if (profile.fitnessLevel === "low" && section.intensity === "high") {
    score -= 1;
  }

  if (score < 0) {
    score = 0;
  }

  const reasons = buildReasonCodes(
    section,
    profile,
    matchedFocus,
    formatMatch,
    fitnessDiff,
    score
  );

  return {
    section,
    score,
    matchedFocus,
    formatMatch,
    reasons,
  };
}

export function recommendSections(
  profile: UserProfile,
  limit = 3
): RecommendationResult[] {
  if (!profile || typeof profile !== "object") {
    console.error("recommendSections: invalid profile", profile);
    return [];
  }

  try {
    const scored = sportSections
      .map((section) => computeScore(section, profile))
      .filter(
        (result): result is RecommendationResult =>
          result !== null && result.score > 0
      )
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit);
  } catch (err) {
    console.error("recommendSections error:", err);
    return [];
  }
}

export function fallbackSection(
  profile: UserProfile
): RecommendationResult | null {
  if (!profile || typeof profile !== "object") {
    console.error("fallbackSection: invalid profile", profile);
    return null;
  }

  try {
    const eligible = sportSections
      .map((section) => computeScore(section, profile))
      .filter((result): result is RecommendationResult => result !== null);

    return eligible.sort((a, b) => b.score - a.score)[0] ?? null;
  } catch (err) {
    console.error("fallbackSection error:", err);
    return null;
  }
}

export function listAllSections(): SportSection[] {
  try {
    return sportSections;
  } catch (err) {
    console.error("listAllSections error:", err);
    return [];
  }
}
