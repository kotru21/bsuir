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

type CountAggregate = { _all: number | bigint };

interface GenderGroupRow {
  gender: string;
  _count: CountAggregate;
}

interface FitnessGroupRow {
  fitnessLevel: string;
  _count: CountAggregate;
}

interface FormatRow {
  format: string | null;
  count: bigint;
}

interface GoalRow {
  goal: string | null;
  count: bigint;
}

interface AgeBucketRow {
  bucket: string;
  count: bigint;
}

interface GenderFitnessRow {
  gender: string;
  fitnessLevel: string;
  count: bigint;
}

interface GoalFormatRow {
  goal: string;
  format: string;
  count: bigint;
}

interface TimelineRow {
  date: string;
  submissions: bigint;
}

function isRecoverablePrismaError(err: unknown): boolean {
  if (!err || typeof err !== "object") {
    return false;
  }

  const errorLike = err as { code?: unknown; name?: unknown };
  const code = typeof errorLike.code === "string" ? errorLike.code : undefined;
  const name = typeof errorLike.name === "string" ? errorLike.name : undefined;

  if (code && ["P2021", "P2022", "P1010", "P1001"].includes(code)) {
    return true;
  }

  return (
    name === "PrismaClientInitializationError" ||
    name === "PrismaClientUnknownRequestError"
  );
}

function logAndReturn<T>(err: unknown, fallback: T): T {
  console.warn("Prisma statistics query failed, returning fallback", err);
  return fallback;
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

function toNumber(value: bigint | number | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === "bigint") {
    return Number(value);
  }
  return value;
}

function normalizeFormats(formats: string[] | null | undefined): string[] {
  return Array.isArray(formats)
    ? formats.map((item) => item.toLowerCase())
    : [];
}

function normalizeGoals(goals: string[] | null | undefined): string[] {
  return Array.isArray(goals) ? goals.map((item) => item.toLowerCase()) : [];
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const prisma = getPrismaClient();
  const empty: OverviewStats = {
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

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    const [
      totalSubmissions,
      submissionsLast7Days,
      averageAgeResult,
      rawGenderGroups,
      rawFitnessGroups,
      avoidContactCount,
      competitionInterestCount,
      lastSubmission,
      rawFormatRows,
      rawGoalRows,
    ] = await Promise.all([
      prisma.surveySubmission.count(),
      prisma.surveySubmission.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      prisma.surveySubmission.aggregate({
        _avg: { age: true },
      }),
      prisma.surveySubmission.groupBy({
        by: ["gender"],
        _count: { _all: true },
      }),
      prisma.surveySubmission.groupBy({
        by: ["fitnessLevel"],
        _count: { _all: true },
      }),
      prisma.surveySubmission.count({
        where: { avoidContact: true },
      }),
      prisma.surveySubmission.count({
        where: { interestedInCompetition: true },
      }),
      prisma.surveySubmission.findFirst({
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.$queryRaw<{ format: string | null; count: bigint }[]>`
        SELECT lower(format) AS format, COUNT(*)::bigint AS count
        FROM "SurveySubmission", LATERAL unnest("preferredFormats") AS format
        GROUP BY lower(format)
        ORDER BY COUNT(*) DESC
        LIMIT 5
      `,
      prisma.$queryRaw<{ goal: string | null; count: bigint }[]>`
        SELECT lower(goal) AS goal, COUNT(*)::bigint AS count
        FROM "SurveySubmission", LATERAL unnest("desiredGoals") AS goal
        GROUP BY lower(goal)
        ORDER BY COUNT(*) DESC
        LIMIT 5
      `,
    ]);

    const genderGroups = rawGenderGroups as GenderGroupRow[];
    const fitnessGroups = rawFitnessGroups as FitnessGroupRow[];
    const formatRows = rawFormatRows as FormatRow[];
    const goalRows = rawGoalRows as GoalRow[];

    if (!totalSubmissions) {
      return empty;
    }

    const averageAge = averageAgeResult._avg.age;

    const genderDistribution: Record<string, number> = {};
    for (const group of genderGroups) {
      genderDistribution[group.gender] = toNumber(group._count._all);
    }

    const fitnessDistribution: Record<string, number> = {};
    for (const group of fitnessGroups) {
      fitnessDistribution[group.fitnessLevel] = toNumber(group._count._all);
    }

    const formatLeaders: { format: string; count: number }[] = [];
    for (const row of formatRows) {
      if (!row.format) {
        continue;
      }
      formatLeaders.push({
        format: row.format,
        count: toNumber(row.count),
      });
    }

    const goalLeaders: { goal: string; count: number }[] = [];
    for (const row of goalRows) {
      if (!row.goal) {
        continue;
      }
      goalLeaders.push({
        goal: row.goal,
        count: toNumber(row.count),
      });
    }

    return {
      totalSubmissions,
      submissionsLast7Days,
      averageAge: averageAge === null ? null : Number(averageAge.toFixed(2)),
      genderDistribution,
      fitnessDistribution,
      contactPreference: {
        avoidContact: avoidContactCount,
        allowContact: totalSubmissions - avoidContactCount,
      },
      competitionInterest: {
        interested: competitionInterestCount,
        notInterested: totalSubmissions - competitionInterestCount,
      },
      formatLeaders,
      goalLeaders,
      lastSubmissionAt: lastSubmission?.createdAt
        ? lastSubmission.createdAt.toISOString()
        : null,
    };
  } catch (err) {
    if (isRecoverablePrismaError(err)) {
      return logAndReturn(err, empty);
    }
    throw err;
  }
}

export async function getDemographicStats(): Promise<DemographicStats> {
  const prisma = getPrismaClient();
  const empty: DemographicStats = {
    ageBuckets: AGE_BUCKETS.map(({ label }) => ({ label, count: 0 })),
    genderByFitness: [],
    goalOverlap: [],
  };

  try {
    const [ageRows, genderFitnessRows, goalRows] = (await Promise.all([
      prisma.$queryRaw<AgeBucketRow[]>`
        SELECT bucket, COUNT(*)::bigint AS count
        FROM (
          SELECT CASE
            WHEN age <= 17 THEN 'До 17'
            WHEN age BETWEEN 18 AND 25 THEN '18-25'
            WHEN age BETWEEN 26 AND 35 THEN '26-35'
            WHEN age BETWEEN 36 AND 45 THEN '36-45'
            ELSE '46+'
          END AS bucket
          FROM "SurveySubmission"
        ) AS buckets
        GROUP BY bucket
      `,
      prisma.$queryRaw<GenderFitnessRow[]>`
        SELECT gender, "fitnessLevel" AS "fitnessLevel", COUNT(*)::bigint AS count
        FROM "SurveySubmission"
        GROUP BY gender, "fitnessLevel"
      `,
      prisma.$queryRaw<GoalFormatRow[]>`
        SELECT
          lower(goal) AS goal,
          lower(format) AS format,
          COUNT(*)::bigint AS count
        FROM "SurveySubmission"
        CROSS JOIN LATERAL unnest("desiredGoals") AS goal
        CROSS JOIN LATERAL unnest("preferredFormats") AS format
        GROUP BY lower(goal), lower(format)
      `,
    ])) as [AgeBucketRow[], GenderFitnessRow[], GoalFormatRow[]];

    const ageMap = new Map<string, number>();
    for (const row of ageRows) {
      ageMap.set(row.bucket, toNumber(row.count));
    }

    return {
      ageBuckets: AGE_BUCKETS.map(({ label }) => ({
        label,
        count: ageMap.get(label) ?? 0,
      })),
      genderByFitness: genderFitnessRows.map((row: GenderFitnessRow) => ({
        gender: row.gender,
        fitnessLevel: row.fitnessLevel,
        count: toNumber(row.count),
      })),
      goalOverlap: (() => {
        const overlap: { goal: string; format: string; count: number }[] = [];
        for (const row of goalRows) {
          if (row.goal && row.format) {
            overlap.push({
              goal: row.goal,
              format: row.format,
              count: toNumber(row.count),
            });
          }
        }
        return overlap;
      })(),
    };
  } catch (err) {
    if (isRecoverablePrismaError(err)) {
      return logAndReturn(err, empty);
    }
    throw err;
  }
}

export async function getTimelineStats(
  rangeDays = 30
): Promise<TimelinePoint[]> {
  const prisma = getPrismaClient();
  const rangeStart = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

  try {
    const rows = (await prisma.$queryRaw<TimelineRow[]>`
      SELECT TO_CHAR("createdAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS date,
             COUNT(*)::bigint AS submissions
      FROM "SurveySubmission"
      WHERE "createdAt" >= ${rangeStart}
      GROUP BY date
      ORDER BY date ASC
    `) as TimelineRow[];

    return rows.map((row: TimelineRow) => ({
      date: row.date,
      submissions: toNumber(row.submissions),
    }));
  } catch (err) {
    if (isRecoverablePrismaError(err)) {
      return logAndReturn(err, []);
    }
    throw err;
  }
}

export async function getSubmissionPage(
  page: number,
  pageSize: number
): Promise<{ items: SubmissionListItem[]; total: number }> {
  const prisma = getPrismaClient();
  const skip = (page - 1) * pageSize;

  let total = 0;
  let entries: SubmissionEntity[] = [];
  try {
    const [count, result] = await prisma.$transaction([
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
    total = count;
    entries = result as SubmissionEntity[];
  } catch (err) {
    if (isRecoverablePrismaError(err)) {
      return logAndReturn(err, { items: [], total: 0 });
    }
    throw err;
  }

  const items: SubmissionListItem[] = entries.map((submission) => {
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
