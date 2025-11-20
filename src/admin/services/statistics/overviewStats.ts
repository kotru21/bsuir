import { getPrismaClient } from "../../../infrastructure/prismaClient.js";
import { isRecoverablePrismaError, logAndReturn, toNumber } from "./helpers.js";
import type {
  FormatRow,
  GenderGroupRow,
  FitnessGroupRow,
  GoalRow,
  OverviewStats,
} from "./types.js";

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
    aiSummaryStats: {
      withSummary: 0,
      withoutSummary: 0,
      coveragePercent: 0,
    },
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
      aiSummaryCount,
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
      prisma.surveySubmission.count({
        where: {
          aiSummary: {
            not: null,
          },
          NOT: {
            aiSummary: {
              equals: "",
            },
          },
        },
      }),
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

    const withSummary = aiSummaryCount;
    const withoutSummary = totalSubmissions - withSummary;
    const coveragePercent = totalSubmissions
      ? Number(((withSummary / totalSubmissions) * 100).toFixed(1))
      : 0;

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
      aiSummaryStats: {
        withSummary,
        withoutSummary,
        coveragePercent,
      },
    };
  } catch (err) {
    if (isRecoverablePrismaError(err)) {
      return logAndReturn(err, empty);
    }
    throw err;
  }
}
