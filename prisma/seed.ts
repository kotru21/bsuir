import { PrismaClient } from "../src/generated/prisma/client/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { sportSections } from "./data/sections.js";

const runtimeEnv =
  (
    globalThis as typeof globalThis & {
      Bun?: { env?: Record<string, string | undefined> };
    }
  ).Bun?.env ??
  process.env ??
  {};

const connectionString = runtimeEnv.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set before running the seed script");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log("Start seeding ...");
  for (const section of sportSections) {
    await prisma.sportSection.upsert({
      where: { id: section.id },
      update: {
        title: section.title,
        summary: section.summary,
        focus: section.focus,
        format: section.format,
        contactLevel: section.contactLevel,
        intensity: section.intensity,
        recommendedFor: section.recommendedFor as object,
        expectedResults: section.expectedResults as object,
        extraBenefits: section.extraBenefits,
        prerequisites: section.prerequisites,
        imagePath: section.imagePath,
        locationHint: section.locationHint,
        similarityVector: section.similarityVector as object,
      },
      create: {
        id: section.id,
        title: section.title,
        summary: section.summary,
        focus: section.focus,
        format: section.format,
        contactLevel: section.contactLevel,
        intensity: section.intensity,
        recommendedFor: section.recommendedFor as object,
        expectedResults: section.expectedResults as object,
        extraBenefits: section.extraBenefits,
        prerequisites: section.prerequisites,
        imagePath: section.imagePath,
        locationHint: section.locationHint,
        similarityVector: section.similarityVector as object,
      },
    });
  }
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
