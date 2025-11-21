import { PrismaClient } from "../src/generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { sportSections } from "./data/sections.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

// Heroku Postgres requires sslmode=no-verify for adapter-pg
const isRemoteDb =
  !connectionString.includes("@127.0.0.1") &&
  !connectionString.includes("@localhost");
const dbUrl =
  isRemoteDb && !connectionString.includes("sslmode=")
    ? `${connectionString}${
        connectionString.includes("?") ? "&" : "?"
      }sslmode=no-verify`
    : connectionString;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: dbUrl }),
} as unknown as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("Start seeding ...");
  console.log(`Total sections to seed: ${sportSections.length}`);

  // Test database connection first
  try {
    await prisma.$connect();
    console.log("Database connection established");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }

  // Check if sections already exist
  const existingCount = await prisma.sportSection.count();
  console.log(`Found ${existingCount} existing sections`);

  if (existingCount >= sportSections.length) {
    console.log("Database already seeded, skipping...");
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  // Seed sections one by one for better error handling
  for (const section of sportSections) {
    try {
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
      successCount++;
      console.log(`✓ Seeded: ${section.title}`);
    } catch (error) {
      errorCount++;
      console.error(`✗ Failed to seed ${section.title}:`, error);
    }
  }

  console.log(
    `Seeding finished: ${successCount} successful, ${errorCount} failed`
  );

  if (errorCount > 0 && successCount === 0) {
    throw new Error("All sections failed to seed");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
