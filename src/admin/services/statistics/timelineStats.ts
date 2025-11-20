import { getPrismaClient } from "../../../infrastructure/prismaClient.js";
import { isRecoverablePrismaError, logAndReturn, toNumber } from "./helpers.js";
import type { TimelinePoint, TimelineRow } from "./types.js";

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
