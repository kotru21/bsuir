import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const seedEnvSchema = z.object({
  ADMIN_BOOTSTRAP_USERNAME: z.string().min(3).optional(),
  ADMIN_BOOTSTRAP_PASSWORD_HASH: z.string().min(16).optional(),
});

async function main() {
  const env = seedEnvSchema.parse(process.env);

  if (env.ADMIN_BOOTSTRAP_USERNAME && env.ADMIN_BOOTSTRAP_PASSWORD_HASH) {
    await prisma.adminUser.upsert({
      where: { username: env.ADMIN_BOOTSTRAP_USERNAME },
      update: {
        passwordHash: env.ADMIN_BOOTSTRAP_PASSWORD_HASH,
        role: "ADMIN",
      },
      create: {
        username: env.ADMIN_BOOTSTRAP_USERNAME,
        passwordHash: env.ADMIN_BOOTSTRAP_PASSWORD_HASH,
        role: "ADMIN",
      },
    });
  }

  const sectionMetricsCount = await prisma.sectionMetric.count();
  if (sectionMetricsCount === 0) {
    await prisma.sectionMetric.createMany({
      data: [
        {
          sectionId: "basketball",
          totalSessions: 210,
          uniqueUsers: 145,
          completedRecommendations: 98,
        },
        {
          sectionId: "swimming",
          totalSessions: 180,
          uniqueUsers: 120,
          completedRecommendations: 86,
        },
        {
          sectionId: "martial-arts",
          totalSessions: 240,
          uniqueUsers: 170,
          completedRecommendations: 132,
        },
      ],
    });
  }

  const segmentMetricsCount = await prisma.segmentMetric.count();
  if (segmentMetricsCount === 0) {
    await prisma.segmentMetric.createMany({
      data: [
        { segmentKey: "age:teen", totalUsers: 90 },
        { segmentKey: "age:adult", totalUsers: 160 },
        { segmentKey: "fitness:beginner", totalUsers: 110 },
        { segmentKey: "fitness:advanced", totalUsers: 55 },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });
