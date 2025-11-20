import { getPrismaClient } from "../../../infrastructure/prismaClient.js";
import {
  isRecoverablePrismaError,
  logAndReturn,
  normalizeFormats,
  normalizeGoals,
} from "./helpers.js";
import type {
  RecommendationEntity,
  SubmissionEntity,
  SubmissionListItem,
} from "./types.js";

export async function getSubmissionPage(
  page: number,
  pageSize: number
): Promise<{ items: SubmissionListItem[]; total: number }> {
  const prisma = getPrismaClient();
  const skip = (page - 1) * pageSize;

  try {
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
    const typedEntries = entries as SubmissionEntity[];

    const items: SubmissionListItem[] = typedEntries.map((submission) => {
      const recommendations: RecommendationEntity[] =
        submission.recommendations ?? [];
      const aiSummary = (submission as { aiSummary?: string | null }).aiSummary;

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
        aiSummary: aiSummary ?? null,
        recommendations: recommendations.map((recommendation) => ({
          sectionId: recommendation.sectionId,
          sectionName: recommendation.sectionName,
          score: recommendation.score,
          rank: recommendation.rank,
          reasons: recommendation.reasons,
        })),
      };
    });

    return { items, total };
  } catch (err) {
    if (isRecoverablePrismaError(err)) {
      return logAndReturn(err, { items: [], total: 0 });
    }
    throw err;
  }
}
