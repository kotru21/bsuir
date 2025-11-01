import { getPrismaClient } from "../../infrastructure/prismaClient.js";

interface RecommendationEntity {
  id: string;
  sectionId: string;
  sectionName: string;
  score: number;
  rank: number;
  reasons: unknown;
  createdAt: Date;
}

interface SubmissionEntity {
  id: string;
  telegramUserId: string | null;
  chatId: string | null;
  age: number;
  gender: string;
  fitnessLevel: string;
  preferredFormats: string[] | null;
  desiredGoals: string[] | null;
  avoidContact: boolean;
  interestedInCompetition: boolean;
  createdAt: Date;
  recommendations?: RecommendationEntity[];
}

type SubmissionBooleanField = "avoidContact" | "interestedInCompetition";

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
  recommendations: {
    sectionId: string;
    sectionName: string;
    score: number;
    rank: number;
    reasons: unknown;
  }[];
}

const AGE_BUCKETS: { label: string; from: number; to: number | null }[] = [
  { label: "До 17", from: 0, to: 17 },
  { label: "18-25", from: 18, to: 25 },
  { label: "26-35", from: 26, to: 35 },
  { label: "36-45", from: 36, to: 45 },
  { label: "46+", from: 46, to: null },
];

function normalizeFormats(formats: string[] | null | undefined): string[] {
  return Array.isArray(formats)
    ? formats.map((item) => item.toLowerCase())
    : [];
}

function normalizeGoals(goals: string[] | null | undefined): string[] {
  return Array.isArray(goals) ? goals.map((item) => item.toLowerCase()) : [];
}

function buildAgeBuckets(submissions: SubmissionEntity[]): {
  label: string;
  count: number;
}[] {
  const totals = new Map<string, number>();

  for (const bucket of AGE_BUCKETS) {
    totals.set(bucket.label, 0);
  }

  for (const submission of submissions) {
    const bucket = AGE_BUCKETS.find(({ from, to }) => {
      if (submission.age < from) return false;
      if (to === null) return submission.age >= from;
      return submission.age >= from && submission.age <= to;
    });

    if (!bucket) {
      continue;
    }

    totals.set(bucket.label, (totals.get(bucket.label) ?? 0) + 1);
  }

  return AGE_BUCKETS.map(({ label }) => ({
    label,
    count: totals.get(label) ?? 0,
  }));
}

function buildGenderFitnessMatrix(
  submissions: SubmissionEntity[]
): { gender: string; fitnessLevel: string; count: number }[] {
  const map = new Map<string, number>();

  for (const submission of submissions) {
    const key = `${submission.gender}|${submission.fitnessLevel}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries()).map(([key, count]) => {
    const [gender, fitnessLevel] = key.split("|");
    return { gender, fitnessLevel, count };
  });
}

function buildGoalOverlap(
  submissions: SubmissionEntity[]
): { goal: string; format: string; count: number }[] {
  const map = new Map<string, number>();

  for (const submission of submissions) {
    const formats = normalizeFormats(submission.preferredFormats);
    const goals = normalizeGoals(submission.desiredGoals);

    for (const goal of goals) {
      for (const format of formats) {
        const key = `${goal}|${format}`;
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    }
  }

  return Array.from(map.entries()).map(([key, count]) => {
    const [goal, format] = key.split("|");
    return { goal, format, count };
  });
}

function countBoolean(
  submissions: SubmissionEntity[],
  key: SubmissionBooleanField
) {
  let trueCount = 0;
  for (const submission of submissions) {
    if (submission[key]) {
      trueCount += 1;
    }
  }
  return {
    trueCount,
    falseCount: submissions.length - trueCount,
  };
}

function aggregateCounts(
  values: string[],
  limit = 5
): { key: string; count: number }[] {
  const map = new Map<string, number>();
  for (const value of values) {
    map.set(value, (map.get(value) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const prisma = getPrismaClient();
  const submissions =
    (await prisma.surveySubmission.findMany()) as SubmissionEntity[];

  if (!submissions.length) {
    return {
      totalSubmissions: 0,
      submissionsLast7Days: 0,
      averageAge: null,
      genderDistribution: {},
      fitnessDistribution: {},
      contactPreference: { avoidContact: 0, allowContact: 0 },
      competitionInterest: { interested: 0, notInterested: 0 },
      formatLeaders: [],
      goalLeaders: [],
      lastSubmissionAt: null,
    };
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const submissionsLast7Days = submissions.filter(
    (item) => item.createdAt >= sevenDaysAgo
  ).length;

  const averageAge =
    submissions.reduce((total, item) => total + item.age, 0) /
    submissions.length;

  const genderDistribution = submissions.reduce<Record<string, number>>(
    (acc: Record<string, number>, item) => {
      acc[item.gender] = (acc[item.gender] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const fitnessDistribution = submissions.reduce<Record<string, number>>(
    (acc: Record<string, number>, item) => {
      acc[item.fitnessLevel] = (acc[item.fitnessLevel] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const contactCounts = countBoolean(submissions, "avoidContact");
  const competitionCounts = countBoolean(
    submissions,
    "interestedInCompetition"
  );

  const allFormats = submissions.flatMap((item) =>
    normalizeFormats(item.preferredFormats)
  );
  const allGoals = submissions.flatMap((item) =>
    normalizeGoals(item.desiredGoals)
  );

  const formatLeaders = aggregateCounts(allFormats).map(({ key, count }) => ({
    format: key,
    count,
  }));
  const goalLeaders = aggregateCounts(allGoals).map(({ key, count }) => ({
    goal: key,
    count,
  }));

  const lastSubmissionAt = submissions
    .map((item) => item.createdAt.getTime())
    .sort((a: number, b: number) => b - a)[0];

  return {
    totalSubmissions: submissions.length,
    submissionsLast7Days,
    averageAge: Number(averageAge.toFixed(2)),
    genderDistribution,
    fitnessDistribution,
    contactPreference: {
      avoidContact: contactCounts.trueCount,
      allowContact: contactCounts.falseCount,
    },
    competitionInterest: {
      interested: competitionCounts.trueCount,
      notInterested: competitionCounts.falseCount,
    },
    formatLeaders,
    goalLeaders,
    lastSubmissionAt: lastSubmissionAt
      ? new Date(lastSubmissionAt).toISOString()
      : null,
  };
}

export async function getDemographicStats(): Promise<DemographicStats> {
  const prisma = getPrismaClient();
  const submissions =
    (await prisma.surveySubmission.findMany()) as SubmissionEntity[];

  return {
    ageBuckets: buildAgeBuckets(submissions),
    genderByFitness: buildGenderFitnessMatrix(submissions),
    goalOverlap: buildGoalOverlap(submissions),
  };
}

export async function getTimelineStats(
  rangeDays = 30
): Promise<TimelinePoint[]> {
  const prisma = getPrismaClient();
  const rangeStart = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

  const submissions = await prisma.surveySubmission.findMany({
    where: {
      createdAt: {
        gte: rangeStart,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const submissionEntries = submissions as SubmissionEntity[];

  const map = new Map<string, number>();
  for (const submission of submissionEntries) {
    const key = submission.createdAt.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, count]) => ({ date, submissions: count }));
}

export async function getSubmissionPage(
  page: number,
  pageSize: number
): Promise<{ items: SubmissionListItem[]; total: number }> {
  const prisma = getPrismaClient();
  const skip = (page - 1) * pageSize;

  const [total, entries] = await prisma.$transaction([
    prisma.surveySubmission.count(),
    prisma.surveySubmission.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        recommendations: {
          orderBy: { rank: "asc" },
        },
      },
    }),
  ]);

  const submissionEntries = entries as SubmissionEntity[];

  const items: SubmissionListItem[] = submissionEntries.map((submission) => {
    const recommendations = submission.recommendations ?? [];

    return {
      id: submission.id,
      createdAt: submission.createdAt.toISOString(),
      profile: {
        age: submission.age,
        gender: submission.gender,
        fitnessLevel: submission.fitnessLevel,
        preferredFormats: normalizeFormats(submission.preferredFormats),
        desiredGoals: normalizeGoals(submission.desiredGoals),
        avoidContact: submission.avoidContact,
        interestedInCompetition: submission.interestedInCompetition,
      },
      recommendations: formatRecommendations(recommendations),
    };
  });

  return { items, total };
}

function formatRecommendations(
  recommendations: RecommendationEntity[]
): SubmissionListItem["recommendations"] {
  return recommendations.map((recommendation) => ({
    sectionId: recommendation.sectionId,
    sectionName: recommendation.sectionName,
    score: recommendation.score,
    rank: recommendation.rank,
    reasons: recommendation.reasons,
  }));
}
