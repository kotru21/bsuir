export type FitnessLevel = "low" | "medium" | "high";

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

export type TrainingFormat = "individual" | "group" | "mixed";

export type ContactLevel = "nonContact" | "lightContact" | "fullContact";

export type GoalPriorityMap = Partial<Record<GoalTag, number>>;
export type FormatPreferenceMap = Partial<Record<TrainingFormat, number>>;

export type VectorGoalKey = `goal:${GoalTag}`;
export type VectorFormatKey = `format:${TrainingFormat}`;
export type VectorIntensityKey = `intensity:${FitnessLevel}`;
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
  format: TrainingFormat;
  contactLevel: ContactLevel;
  intensity: FitnessLevel;
  recommendedFor: Array<{
    fitnessLevel?: FitnessLevel;
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
  gender: "male" | "female" | "unspecified";
  fitnessLevel: FitnessLevel;
  preferredFormats: TrainingFormat[];
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
      formats: TrainingFormat[];
      contribution: number;
    }
  | {
      kind: "similarity-intensity";
      profileLevel: FitnessLevel;
      sectionLevel: FitnessLevel;
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
