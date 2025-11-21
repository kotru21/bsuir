// Re-export Prisma enums for consistency
export type {
  Gender,
  FitnessLevel,
  TrainingFormat,
  ContactLevel,
} from "./generated/client.js";

export type GoalTag =
  | "strength"
  | "endurance"
  | "flexibility"
  | "teamwork"
  | "martialArts"
  | "ballSports"
  | "aquatic"
  | "dance"
  | "coordination"
  | "rehabilitation"
  | "weightManagement"
  | "aesthetics"
  | "competition";

export type GoalPriorityMap = Partial<Record<GoalTag, number>>;
export type FormatPreferenceMap = Partial<
  Record<import("./generated/client.js").TrainingFormat, number>
>;

export type VectorGoalKey = `goal:${GoalTag}`;
export type VectorFormatKey =
  `format:${import("./generated/client.js").TrainingFormat}`;
export type VectorIntensityKey =
  `intensity:${import("./generated/client.js").FitnessLevel}`;
export type VectorKey =
  | VectorGoalKey
  | VectorFormatKey
  | VectorIntensityKey
  | "competition"
  | "contactTolerance";

export type SimilarityVector = Partial<Record<VectorKey, number>>;

export interface SectionTimeline {
  shortTerm: string; // ~1 month
  midTerm: string; // ~3 months
  longTerm: string; // ~6+ months
}

export interface SportSection {
  id: string;
  title: string;
  summary: string;
  focus: GoalTag[];
  format: import("./generated/client.js").TrainingFormat;
  contactLevel: import("./generated/client.js").ContactLevel;
  intensity: import("./generated/client.js").FitnessLevel;
  recommendedFor: Array<{
    fitnessLevel?: import("./generated/client.js").FitnessLevel;
    note: string;
  }>;
  expectedResults: SectionTimeline;
  extraBenefits?: string[];
  prerequisites?: string;
  imagePath?: string;
  locationHint?: string;
  similarityVector?: SimilarityVector;
}

export interface UserProfile {
  age: number;
  gender: import("./generated/client.js").Gender;
  fitnessLevel: import("./generated/client.js").FitnessLevel;
  preferredFormats: import("./generated/client.js").TrainingFormat[];
  desiredGoals: GoalTag[];
  avoidContact: boolean;
  interestedInCompetition: boolean;
  goalPriorities?: GoalPriorityMap;
  formatPriorities?: FormatPreferenceMap;
  intensityComfort?: number; // 0..1 prefers lower intensity, 1 == high
  intensityFlexibility?: number; // 0 rigid, 1 flexible
  contactTolerance?: number; // 0 avoids, 1 accepts
  competitionDrive?: number; // 0 indifferent, 1 focused
}

export type RecommendationReason =
  | { kind: "similarity-goal"; tags: GoalTag[]; contribution: number }
  | {
      kind: "similarity-format";
      formats: import("./generated/client.js").TrainingFormat[];
      contribution: number;
    }
  | {
      kind: "similarity-intensity";
      profileLevel: import("./generated/client.js").FitnessLevel;
      sectionLevel: import("./generated/client.js").FitnessLevel;
      contribution: number;
    }
  | {
      kind: "competition-alignment";
      contribution: number;
    }
  | {
      kind: "contact-compatibility";
      contribution: number;
    }
  | {
      kind: "vector-gap";
      dimension: VectorKey;
      contribution: number;
    }
  | { kind: "extra-benefits"; benefits: string[] }
  | { kind: "catalog-reference"; note: string };

export interface RecommendationResult {
  section: SportSection;
  score: number;
  reasons: RecommendationReason[];
  vector?: SimilarityVector;
}
