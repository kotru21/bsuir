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
}

export interface UserProfile {
  age: number;
  gender: "male" | "female" | "unspecified";
  fitnessLevel: FitnessLevel;
  preferredFormats: TrainingFormat[];
  desiredGoals: GoalTag[];
  avoidContact: boolean;
  interestedInCompetition: boolean;
}

export type RecommendationReason =
  | { kind: "goal-match"; tags: GoalTag[] }
  | {
      kind: "format-aligned";
      format: TrainingFormat;
      preferred: TrainingFormat[];
    }
  | {
      kind: "format-mismatch";
      format: TrainingFormat;
      preferred: TrainingFormat[];
    }
  | {
      kind: "fitness-balanced";
      profileLevel: FitnessLevel;
      intensity: FitnessLevel;
    }
  | {
      kind: "fitness-progressive";
      profileLevel: FitnessLevel;
      intensity: FitnessLevel;
    }
  | {
      kind: "fitness-gap";
      profileLevel: FitnessLevel;
      intensity: FitnessLevel;
    }
  | { kind: "competition-path" }
  | { kind: "extra-benefits"; benefits: string[] }
  | { kind: "catalog-reference"; note: string };

export interface RecommendationResult {
  section: SportSection;
  score: number;
  matchedFocus: GoalTag[];
  formatMatch: boolean;
  reasons: RecommendationReason[];
}
