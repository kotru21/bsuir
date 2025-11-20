import type {
  FitnessLevel,
  GoalTag,
  RecommendationReason,
  SimilarityVector,
  SportSection,
  TrainingFormat,
  UserProfile,
  VectorKey,
} from "../types.js";
import type { Contribution } from "./internalTypes.js";
import { round } from "./vectorSpaces.js";

function collectTopGoalTags(contributions: Contribution[]): GoalTag[] {
  return contributions
    .filter((item) => item.dimension.startsWith("goal:"))
    .slice(0, 2)
    .map((item) => item.dimension.split(":")[1] as GoalTag);
}

function findFormatHighlight(
  contributions: Contribution[]
): [TrainingFormat, number] | null {
  const match = contributions.find((item) =>
    item.dimension.startsWith("format:")
  );
  if (!match) {
    return null;
  }
  return [match.dimension.split(":")[1] as TrainingFormat, match.weight];
}

function findIntensityHighlight(
  contributions: Contribution[]
): [FitnessLevel, number] | null {
  const match = contributions.find((item) =>
    item.dimension.startsWith("intensity:")
  );
  if (!match) {
    return null;
  }
  return [match.dimension.split(":")[1] as FitnessLevel, match.weight];
}

export function buildReasons(
  contributions: Contribution[],
  profile: UserProfile,
  section: SportSection,
  _userVector: SimilarityVector,
  sectionVector: SimilarityVector
): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];
  const contributionMap = new Map(
    contributions.map((entry) => [entry.dimension, entry.weight])
  );

  const topGoalTags = collectTopGoalTags(contributions);
  if (topGoalTags.length) {
    const weight = topGoalTags.reduce(
      (sum, tag) =>
        sum + (contributionMap.get(`goal:${tag}` as VectorKey) ?? 0),
      0
    );
    reasons.push({
      kind: "similarity-goal",
      tags: topGoalTags,
      contribution: round(weight),
    });
  }

  const formatHighlight = findFormatHighlight(contributions);
  if (formatHighlight) {
    const [format, weight] = formatHighlight;
    reasons.push({
      kind: "similarity-format",
      formats: [format],
      contribution: round(weight),
    });
  }

  const intensityHighlight = findIntensityHighlight(contributions);
  if (intensityHighlight) {
    const [level, weight] = intensityHighlight;
    reasons.push({
      kind: "similarity-intensity",
      profileLevel: profile.fitnessLevel,
      sectionLevel: level,
      contribution: round(weight),
    });
  }

  const competitionWeight = contributionMap.get("competition");
  if (competitionWeight) {
    reasons.push({
      kind: "competition-alignment",
      contribution: round(competitionWeight),
    });
  }

  const contactWeight = contributionMap.get("contactTolerance");
  if (typeof contactWeight === "number" && contactWeight > 0) {
    reasons.push({
      kind: "contact-compatibility",
      contribution: round(contactWeight),
    });
  }

  const desiredGoals = profile.desiredGoals ?? [];
  if (!topGoalTags.length && desiredGoals.length) {
    const missingGoal = desiredGoals.find(
      (tag) => !section.focus.includes(tag)
    );
    if (missingGoal) {
      reasons.push({
        kind: "vector-gap",
        dimension: `goal:${missingGoal}` as VectorKey,
        contribution: 0,
      });
    }
  }

  const preferredFormats = profile.preferredFormats ?? [];
  if (
    !formatHighlight &&
    preferredFormats.length > 0 &&
    sectionVector[`format:${section.format}` as VectorKey] !== 1
  ) {
    const fallbackFormat = preferredFormats[0];
    if (fallbackFormat) {
      reasons.push({
        kind: "vector-gap",
        dimension: `format:${fallbackFormat}` as VectorKey,
        contribution: 0,
      });
    }
  }

  if (section.extraBenefits?.length) {
    reasons.push({
      kind: "extra-benefits",
      benefits: section.extraBenefits.slice(0, 2),
    });
  }

  if (!reasons.length) {
    reasons.push({
      kind: "catalog-reference",
      note: "Подбор выполнен по основным параметрам профиля.",
    });
  }

  return reasons;
}
