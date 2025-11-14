import type { RecommendationResult, UserProfile } from "../types.js";
import { getPrismaClient } from "../infrastructure/prismaClient.js";

export interface SubmissionRecordPayload {
  profile: UserProfile;
  recommendations: RecommendationResult[];
  telegramUserId?: number;
  chatId?: number | string;
  aiSummary?: string | null;
}

export async function recordSubmission(
  payload: SubmissionRecordPayload
): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.warn(
      "DATABASE_URL is not configured; skipping submission persistence."
    );
    return;
  }

  const prisma = getPrismaClient();

  const { profile, recommendations } = payload;
  if (!profile) {
    throw new Error("Submission profile is required");
  }

  const aiSummary =
    typeof payload.aiSummary === "string" ? payload.aiSummary.trim() : null;

  const recommendationData = recommendations.slice(0, 5).map((item, index) => ({
    sectionId: item.section.id,
    sectionName: item.section.title,
    score: item.score,
    rank: index + 1,
    reasons: item.reasons,
  }));

  await prisma.surveySubmission.create({
    data: {
      telegramUserId: payload.telegramUserId
        ? String(payload.telegramUserId)
        : null,
      chatId: payload.chatId ? String(payload.chatId) : null,
      age: profile.age,
      gender: profile.gender,
      fitnessLevel: profile.fitnessLevel,
      preferredFormats: profile.preferredFormats,
      // @ts-expect-error - preferredTimes was added to Prisma schema in migration; regenerate client to include it
      preferredTimes: profile.preferredTimes ?? [],
      desiredGoals: profile.desiredGoals,
      avoidContact: profile.avoidContact,
      interestedInCompetition: profile.interestedInCompetition,
      aiSummary: aiSummary && aiSummary.length ? aiSummary : undefined,
      recommendations: recommendationData.length
        ? {
            create: recommendationData,
          }
        : undefined,
    },
  });
}

export async function recordRecommendationEvent(data: {
  telegramUserId?: number;
  chatId?: number | string;
  sectionId: string;
  eventType: "impression" | "click" | "conversion";
  payload?: unknown;
}): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.warn(
      "DATABASE_URL is not configured; skipping recommendation event persistence."
    );
    return;
  }

  const prisma = getPrismaClient();
  // If prisma Client typed models are not generated, this cast allows usage while keeping lint rules.
  await (
    prisma as unknown as {
      recommendationEvent: { create: (args: unknown) => Promise<unknown> };
    }
  ).recommendationEvent.create({
    data: {
      telegramUserId: data.telegramUserId ? String(data.telegramUserId) : null,
      chatId: data.chatId ? String(data.chatId) : null,
      sectionId: data.sectionId,
      eventType: data.eventType,
      payload: data.payload,
    },
  });
}
