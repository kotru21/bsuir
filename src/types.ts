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

export interface RecommendationResult {
  section: SportSection;
  score: number;
  matchedFocus: GoalTag[];
  formatMatch: boolean;
  reason: string[];
}
