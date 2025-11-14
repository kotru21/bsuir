import fs from "fs";
import { getPrismaClient } from "../infrastructure/prismaClient.js";

// Export a CSV with one row per (submission, candidate) - for training
// features: age, gender, fitnessLevel, preferredFormats, desiredGoals,
// sectionId, sectionTags, env ruleScore (if stored), rank, popularity, scheduleMatch
// label: clicked (1/0), converted (1/0)

export async function exportTrainingCSV(outputPath = "training_dataset.csv") {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not configured; skipping export.");
    return;
  }
  const prisma = getPrismaClient();

  const submissions = await prisma.surveySubmission.findMany({
    include: { recommendations: true },
  });

  // Prisma client may not include RecommendationEvent if client generation wasn't run.
  // Use a small ad-hoc type to avoid `any` and maintain linting rules.
  type RecommendationEventRow = {
    sectionId: string;
    eventType: string;
    chatId?: string | null;
    telegramUserId?: string | null;
  };
  const events = await (
    prisma as unknown as {
      recommendationEvent: {
        findMany: () => Promise<RecommendationEventRow[]>;
      };
    }
  ).recommendationEvent.findMany();

  // Build map of clicks/conversions by sectionId + chatId
  const clickMap = new Map<string, number>();
  const convertMap = new Map<string, number>();

  for (const ev of events) {
    const key = `${ev.chatId || ev.telegramUserId || ""}::${ev.sectionId}`;
    if (ev.eventType === "click")
      clickMap.set(key, (clickMap.get(key) ?? 0) + 1);
    if (ev.eventType === "conversion")
      convertMap.set(key, (convertMap.get(key) ?? 0) + 1);
  }

  const rows: string[] = [];
  rows.push(
    [
      "age",
      "gender",
      "fitnessLevel",
      "preferredFormats",
      "desiredGoals",
      "sectionId",
      "rank",
      "score",
      "popularity",
      "clicked",
      "converted",
    ].join(",")
  );

  for (const s of submissions) {
    for (const rec of s.recommendations) {
      const key = `${s.chatId || s.telegramUserId || ""}::${rec.sectionId}`;
      const clicked = clickMap.has(key) ? 1 : 0;
      const converted = convertMap.has(key) ? 1 : 0;

      rows.push(
        [
          s.age,
          s.gender,
          s.fitnessLevel,
          JSON.stringify(s.preferredFormats),
          JSON.stringify(s.desiredGoals),
          rec.sectionId,
          rec.rank,
          rec.score,
          rec.sectionId ? "" : "",
          clicked,
          converted,
        ]
          .map((c) =>
            typeof c === "string" ? `"${String(c).replace(/"/g, '""')}"` : c
          )
          .join(",")
      );
    }
  }

  fs.writeFileSync(outputPath, rows.join("\n"));
  console.log(`Exported training CSV to: ${outputPath}`);
}

if (process.argv[2] === "--export") {
  exportTrainingCSV(process.argv[3] ?? "training_dataset.csv").catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
