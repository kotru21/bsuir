import { sportSections } from "./data/sections.js";
import * as contentRecommender from "./services/contentRecommender.js";
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

  // schedule-based boosting:
  // - if user prefers 'evening', give large boost to evening sections (wrestling)
  // - otherwise give small boost when section schedule intersects user's preferred times
  const preferredTimes = profile.preferredTimes ?? [];
  const sectionTimes = section.scheduleTags ?? [];
  const scheduleMatch = preferredTimes.some((t) => sectionTimes.includes(t));

  if (preferredTimes.includes("evening")) {
    if (sectionTimes.includes("evening")) {
      // evening preference intentionally prioritized (in this university only wrestling is evening)
      score += 4;
    } else {
      // if the user requested evening but section is not evening, give small penalty to lower relevance
      score -= 1;
    }
  } else if (scheduleMatch) {
    score += 2;
  }

  // popularity boost: small positive from 0..1
  if (typeof section.popularity === "number" && section.popularity > 0) {
    score += Math.round(section.popularity * 2); // boost 0..2
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
    const mode =
      (process.env.RECOMMENDER_MODE as "rules" | "tfidf" | "hybrid") || "rules";

    if (mode === "tfidf") {
      return contentRecommender.queryProfile(profile, limit);
    }

    const ruleResults = sportSections
      .map((section) => computeScore(section, profile))
      .filter(
        (result): result is RecommendationResult =>
          result !== null && result.score > 0
      );

    if (mode === "rules") {
      return ruleResults.sort((a, b) => b.score - a.score).slice(0, limit);
    }

    // hybrid: combine rule score and TF-IDF content match
    const tfRecs = contentRecommender.queryProfile(
      profile,
      sportSections.length
    );
    // build map of tf scores
    const tfMap = new Map(tfRecs.map((r) => [r.section.id, r.score]));

    const maxRule = Math.max(...ruleResults.map((r) => r.score), 1);
    const maxTf = Math.max(...Array.from(tfMap.values()), 1);

    const alpha = Number(process.env.RECOMMENDER_ALPHA ?? 0.6); // weight for rules
    const beta = Number(process.env.RECOMMENDER_BETA ?? 0.4); // weight for tfidf

    const hybrid = ruleResults
      .map((r) => {
        const tf = tfMap.get(r.section.id) ?? 0;
        const normRule = r.score / maxRule;
        const normTf = tf / maxTf;
        const combined = alpha * normRule + beta * normTf;
        return { ...r, score: Math.round(combined * 1000) / 1000 };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return hybrid;
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
    const mode =
      (process.env.RECOMMENDER_MODE as "rules" | "tfidf" | "hybrid") || "rules";

    if (mode === "tfidf") {
      const recs = contentRecommender.queryProfile(profile, 1);
      return recs[0] ?? null;
    }

    const eligible = sportSections
      .map((section) => computeScore(section, profile))
      .filter((result): result is RecommendationResult => result !== null);

    if (mode === "hybrid") {
      const rec = eligible.sort((a, b) => b.score - a.score)[0] ?? null;
      if (rec && rec.score > 0) return rec;
      // try content-based fallback
      const recs = contentRecommender.queryProfile(profile, 1);
      return recs[0] ?? null;
    }

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
