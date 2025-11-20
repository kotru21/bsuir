import { getPrismaClient } from "./infrastructure/prismaClient.js";
import type {
  ContactLevel,
  FitnessLevel,
  GoalTag,
  RecommendationReason,
  RecommendationResult,
  SectionTimeline,
  SimilarityVector,
  SportSection,
  TrainingFormat,
  UserProfile,
  VectorKey,
} from "./types.js";

// Cache for sections to avoid DB hits on every request
let sectionsCache: SportSection[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getAllSections(): Promise<SportSection[]> {
  const now = Date.now();
  if (sectionsCache && now - cacheTimestamp < CACHE_TTL_MS) {
    return sectionsCache;
  }

  const prisma = getPrismaClient();
  try {
    const sections = await prisma.sportSection.findMany();

    const mapped = sections.map((s) => ({
      ...s,
      focus: s.focus as GoalTag[],
      format: s.format as TrainingFormat,
      contactLevel: s.contactLevel as ContactLevel,
      intensity: s.intensity as FitnessLevel,
      recommendedFor: s.recommendedFor as any,
      expectedResults: s.expectedResults as any,
      similarityVector: s.similarityVector as any,
      prerequisites: s.prerequisites ?? undefined,
      imagePath: s.imagePath ?? undefined,
      locationHint: s.locationHint ?? undefined,
    }));

    sectionsCache = mapped;
    cacheTimestamp = now;
    return mapped;
  } catch (e) {
    console.error("Failed to fetch sections from DB", e);
    return [];
  }
}

const INTENSITY_LEVELS: FitnessLevel[] = ["low", "medium", "high"];
const ALL_FORMATS: TrainingFormat[] = ["individual", "group", "mixed"];

const fitnessScalar: Record<FitnessLevel, number> = {
  low: 0,
  medium: 0.5,
  high: 1,
};

const contactScalar: Record<string, number> = {
  nonContact: 0,
  lightContact: 0.6,
  fullContact: 1,
};

type NormalizedVector = Record<string, number>;

interface Contribution {
  dimension: VectorKey;
  weight: number;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function round(value: number, digits = 4): number {
  return Number(value.toFixed(digits));
}

function buildUserVector(profile: UserProfile): SimilarityVector {
  const vector: SimilarityVector = {};

  const desiredGoals = profile.desiredGoals ?? [];
  if (desiredGoals.length) {
    const priorities = profile.goalPriorities ?? {};
    const fallbackWeight = desiredGoals.length ? 1 / desiredGoals.length : 1;
    desiredGoals.forEach((tag) => {
      const weight = priorities[tag] ?? fallbackWeight;
      vector[`goal:${tag}` as VectorKey] = round(weight);
    });
  }

  const formats = profile.preferredFormats?.length
    ? profile.preferredFormats
    : ALL_FORMATS;
  const formatPriorities = profile.formatPriorities ?? {};
  const fallbackFormatWeight = formats.length ? 1 / formats.length : 1;
  formats.forEach((format) => {
    const weight = formatPriorities[format] ?? fallbackFormatWeight;
    vector[`format:${format}` as VectorKey] = round(weight);
  });

  const comfortTarget = clamp01(
    profile.intensityComfort ?? fitnessScalar[profile.fitnessLevel] ?? 0.5
  );
  const flexibility = clamp01(profile.intensityFlexibility ?? 0.4);
  const tolerance = 0.35 + flexibility * 0.5;

  INTENSITY_LEVELS.forEach((level) => {
    const levelValue = fitnessScalar[level];
    const distance = Math.abs(comfortTarget - levelValue);
    const weight = Math.max(0, 1 - distance / tolerance);
    if (weight > 0) {
      vector[`intensity:${level}` as VectorKey] = round(weight);
    }
  });

  const competitionDrive = clamp01(
    profile.competitionDrive ?? (profile.interestedInCompetition ? 1 : 0)
  );
  if (competitionDrive > 0) {
    vector.competition = round(competitionDrive);
  }

  const contactTolerance = clamp01(
    profile.contactTolerance ?? (profile.avoidContact ? 0 : 1)
  );
  vector.contactTolerance = round(contactTolerance);

  return vector;
}

function buildSectionVector(section: SportSection): SimilarityVector {
  if (section.similarityVector) {
    return { ...section.similarityVector };
  }
  const vector: SimilarityVector = {};

  section.focus.forEach((tag) => {
    vector[`goal:${tag}` as VectorKey] = 1;
  });

  const formatKey = `format:${section.format}` as VectorKey;
  vector[formatKey] = 1;
  if (section.format === "mixed") {
    vector["format:individual"] = Math.max(
      vector["format:individual"] ?? 0,
      0.6
    );
    vector["format:group"] = Math.max(vector["format:group"] ?? 0, 0.6);
  }

  vector[`intensity:${section.intensity}` as VectorKey] = 1;
  vector.competition = section.focus.includes("competition") ? 1 : 0;
  vector.contactTolerance = contactScalar[section.contactLevel] ?? 0.5;

  return vector;
}

function normalizeVector(vector: SimilarityVector): NormalizedVector | null {
  const entries = Object.entries(vector).filter(
    ([, value]) => typeof value === "number" && value > 0
  );
  if (!entries.length) {
    return null;
  }
  const magnitude = Math.sqrt(
    entries.reduce((sum, [, value]) => sum + value * value, 0)
  );
  if (!magnitude || !Number.isFinite(magnitude)) {
    return null;
  }
  const normalized: NormalizedVector = {};
  entries.forEach(([key, value]) => {
    normalized[key] = value / magnitude;
  });
  return normalized;
}

function computeCosineSimilarity(
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

function buildReasons(
  contributions: Contribution[],
  profile: UserProfile,
  section: SportSection,
  userVector: SimilarityVector,
  sectionVector: SimilarityVector
): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];
  const contributionMap = new Map(
    contributions.map((entry) => [entry.dimension, entry.weight])
  );

  const topGoalTags = contributions
    .filter((item) => item.dimension.startsWith("goal:"))
    .slice(0, 2)
    .map((item) => item.dimension.split(":")[1] as GoalTag);
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

  const formatHighlight = contributions.find((item) =>
    item.dimension.startsWith("format:")
  );
  if (formatHighlight) {
    const format = formatHighlight.dimension.split(":")[1] as TrainingFormat;
    reasons.push({
      kind: "similarity-format",
      formats: [format],
      contribution: round(formatHighlight.weight),
    });
  }

  const intensityHighlight = contributions.find((item) =>
    item.dimension.startsWith("intensity:")
  );
  if (intensityHighlight) {
    const level = intensityHighlight.dimension.split(":")[1] as FitnessLevel;
    reasons.push({
      kind: "similarity-intensity",
      profileLevel: profile.fitnessLevel,
      sectionLevel: level,
      contribution: round(intensityHighlight.weight),
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

  if (!topGoalTags.length && profile.desiredGoals.length) {
    const missingGoal = profile.desiredGoals.find(
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

  if (
    !formatHighlight &&
    (profile.preferredFormats?.length ?? 0) > 0 &&
    sectionVector[`format:${section.format}` as VectorKey] !== 1
  ) {
    const fallbackFormat = profile.preferredFormats[0];
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

function isContactCompatible(
  section: SportSection,
  profile: UserProfile
): boolean {
  const tolerance = clamp01(
    profile.contactTolerance ?? (profile.avoidContact ? 0 : 1)
  );
  if (tolerance <= 0 && section.contactLevel !== "nonContact") {
    return false;
  }
  if (tolerance < 0.4 && section.contactLevel === "fullContact") {
    return false;
  }
  return true;
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

function applyStrictFilters(
  section: SportSection,
  profile: UserProfile
): boolean {
  // Strict contact filter
  if (profile.avoidContact && section.contactLevel !== "nonContact") {
    return false;
  }

  // Strict format filter
  if (profile.preferredFormats?.length > 0) {
    if (!profile.preferredFormats.includes(section.format)) {
      return false;
    }
  }

  return true;
}

function scoreSections(
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

export async function recommendSections(
  profile: UserProfile,
  limit = 3
): Promise<RecommendationResult[]> {
  if (!profile || typeof profile !== "object") {
    console.error("recommendSections: invalid profile", profile);
    return [];
  }

  try {
    const allSections = await getAllSections();
    const filtered = allSections.filter((s) => applyStrictFilters(s, profile));
    const scored = scoreSections(filtered, profile);
    return scored.slice(0, limit);
  } catch (err) {
    console.error("recommendSections error:", err);
    return [];
  }
}

export async function fallbackSection(
  profile: UserProfile
): Promise<RecommendationResult | null> {
  if (!profile || typeof profile !== "object") {
    console.error("fallbackSection: invalid profile", profile);
    return null;
  }

  try {
    const allSections = await getAllSections();
    const filtered = allSections.filter((s) => applyStrictFilters(s, profile));
    const scored = scoreSections(filtered, profile, true);
    return scored[0] ?? null;
  } catch (err) {
    console.error("fallbackSection error:", err);
    return null;
  }
}

export async function listAllSections(): Promise<SportSection[]> {
  try {
    return await getAllSections();
  } catch (err) {
    console.error("listAllSections error:", err);
    return [];
  }
}
