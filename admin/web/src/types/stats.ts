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

export interface SubmissionListResponse {
  items: SubmissionListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
