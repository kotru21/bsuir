import type {
  FitnessLevel,
  SimilarityVector,
  SportSection,
  TrainingFormat,
  UserProfile,
  VectorKey,
} from "../types.js";
import type { NormalizedVector } from "./internalTypes.js";

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

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function round(value: number, digits = 4): number {
  return Number(value.toFixed(digits));
}

export function buildUserVector(profile: UserProfile): SimilarityVector {
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

export function buildSectionVector(section: SportSection): SimilarityVector {
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

export function normalizeVector(
  vector: SimilarityVector
): NormalizedVector | null {
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
