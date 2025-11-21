import { PrismaClient } from "../src/generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { sportSections } from "./data/sections.js";

const connectionString = process.env.DATABASE_URL;
if (connectionString) {
  process.env.DATABASE_URL = connectionString;
}

const adapterConfig = connectionString ? { connectionString } : {};

const prisma = new PrismaClient({
  adapter: new PrismaPg(adapterConfig),
} as unknown as ConstructorParameters<typeof PrismaClient>[0]);

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
