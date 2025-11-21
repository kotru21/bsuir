import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // path to Prisma schema
  schema: "prisma/schema.prisma",
  // datasource configuration moves to prisma.config.ts in Prisma v7
  datasource: {
    url: env("DATABASE_URL"),
  },
  // keep migrations directory consistent with previous versions and seed configuration
  migrations: {
    path: "prisma/migrations",
    // seed script moved under migrations to match PrismaConfig typings
    seed: "tsx prisma/seed.ts",
  },
});
