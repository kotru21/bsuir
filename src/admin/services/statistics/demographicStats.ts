import { getPrismaClient } from "../../../infrastructure/prismaClient.js";
import {
  AGE_BUCKETS,
  isRecoverablePrismaError,
  logAndReturn,
  toNumber,
} from "./helpers.js";
import type {
  AgeBucketRow,
  DemographicStats,
  GenderFitnessGroup,
  GoalFormatRow,
} from "./types.js";

export async function getDemographicStats(): Promise<DemographicStats> {
  const prisma = getPrismaClient();
  const empty: DemographicStats = {
    ageBuckets: AGE_BUCKETS.map(({ label }) => ({ label, count: 0 })),
    genderByFitness: [],
    goalOverlap: [],
  };

  try {
    const [ageRows, genderFitnessGroups, goalRows] = (await Promise.all([
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
      prisma.surveySubmission.groupBy({
        by: ["gender", "fitnessLevel"],
        _count: { _all: true },
      }),
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
    ])) as [AgeBucketRow[], GenderFitnessGroup[], GoalFormatRow[]];

    const ageMap = new Map<string, number>();
    for (const row of ageRows) {
      ageMap.set(row.bucket, toNumber(row.count));
    }

    return {
      ageBuckets: AGE_BUCKETS.map(({ label }) => ({
        label,
        count: ageMap.get(label) ?? 0,
      })),
      genderByFitness: genderFitnessGroups.map((row) => ({
        gender: row.gender,
        fitnessLevel: row.fitnessLevel,
        count: toNumber(row._count._all),
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
