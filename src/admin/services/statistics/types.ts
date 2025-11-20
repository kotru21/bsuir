export interface RecommendationEntity {
  sectionId: string;
  sectionName: string;
  score: number;
  rank: number;
  reasons: unknown;
}

export interface SubmissionEntity {
  id: string;
  createdAt: Date;
  age: number;
  gender: string;
  fitnessLevel: string;
  preferredFormats: string[] | null | undefined;
  desiredGoals: string[] | null | undefined;
  avoidContact: boolean;
  interestedInCompetition: boolean;
  aiSummary?: string | null;
  recommendations: RecommendationEntity[];
}

type CountAggregate = { _all: number | bigint };

export interface GenderGroupRow {
  gender: string;
  _count: CountAggregate;
}

export interface FitnessGroupRow {
  fitnessLevel: string;
  _count: CountAggregate;
}

export interface FormatRow {
  format: string | null;
  count: bigint;
}

export interface GoalRow {
  goal: string | null;
  count: bigint;
}

export interface AgeBucketRow {
  bucket: string;
  count: bigint;
}

export interface GenderFitnessGroup {
  gender: string;
  fitnessLevel: string;
  _count: CountAggregate;
}

export interface GoalFormatRow {
  goal: string;
  format: string;
  count: bigint;
}

export interface TimelineRow {
  date: string;
  submissions: bigint;
}

export interface OverviewStats {
  totalSubmissions: number;
  submissionsLast7Days: number;
  averageAge: number | null;
  genderDistribution: Record<string, number>;
  fitnessDistribution: Record<string, number>;
  contactPreference: {
    avoidContact: number;
    allowContact: number;
  };
  competitionInterest: {
    interested: number;
    notInterested: number;
  };
  formatLeaders: { format: string; count: number }[];
  goalLeaders: { goal: string; count: number }[];
  lastSubmissionAt: string | null;
  aiSummaryStats: {
    withSummary: number;
    withoutSummary: number;
    coveragePercent: number;
  };
}

export interface DemographicStats {
  ageBuckets: { label: string; count: number }[];
  genderByFitness: { gender: string; fitnessLevel: string; count: number }[];
  goalOverlap: { goal: string; format: string; count: number }[];
}

export interface TimelinePoint {
  date: string;
  submissions: number;
}

export interface SubmissionListItem {
  id: string;
  createdAt: string;
  profile: {
    age: number;
    gender: string;
    fitnessLevel: string;
    preferredFormats: string[];
    desiredGoals: string[];
    avoidContact: boolean;
    interestedInCompetition: boolean;
  };
  aiSummary: string | null;
  recommendations: {
    sectionId: string;
    sectionName: string;
    score: number;
    rank: number;
    reasons: unknown;
  }[];
}
