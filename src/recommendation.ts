import { sportSections } from "./data/sections.js";
import type {
  RecommendationResult,
  SportSection,
  UserProfile,
  GoalTag,
  TrainingFormat,
} from "./types.js";
import { goalTagLabels, formatLabelsRu } from "./bot/constants.js";

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

function buildReasons(
  section: SportSection,
  profile: UserProfile,
  matchedFocus: GoalTag[],
  score: number
): string[] {
  const reasons: string[] = [];

  if (matchedFocus.length) {
    const focusLabels = matchedFocus.map((tag) => goalTagLabels[tag] ?? tag);
    reasons.push(`Соответствует целям: ${focusLabels.join(", ")}.`);
  }

  if (formatMatches(section, profile.preferredFormats)) {
    if (profile.preferredFormats.length > 0) {
      reasons.push(
        `Формат занятий (${
          formatLabelsRu[section.format] ?? section.format
        }) совпадает с предпочтениями.`
      );
    }
  } else {
    reasons.push(
      "Формат отличается от предпочтительного, но остается приемлемым."
    );
  }

  const fitnessDiff = Math.abs(
    fitnessWeights[profile.fitnessLevel] - fitnessWeights[section.intensity]
  );
  if (fitnessDiff === 0) {
    reasons.push("Интенсивность соответствует текущему уровню подготовки.");
  } else if (fitnessDiff === 1) {
    reasons.push(
      "Интенсивность немного выше и поможет быстрее прогрессировать."
    );
  } else {
    reasons.push(
      "Потребуется подготовительный период или консультация тренера."
    );
  }

  if (
    profile.interestedInCompetition &&
    section.focus.includes("competition")
  ) {
    reasons.push("Программа включает путь к участию в соревнованиях.");
  }

  if (score > 0 && section.extraBenefits?.length) {
    reasons.push(
      `Дополнительные плюсы: ${section.extraBenefits.slice(0, 2).join(", ")}.`
    );
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

  if (formatMatches(section, profile.preferredFormats)) {
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

  const reason = buildReasons(section, profile, matchedFocus, score);

  return {
    section,
    score,
    matchedFocus,
    formatMatch: formatMatches(section, profile.preferredFormats),
    reason,
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
