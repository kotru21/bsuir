import path from "node:path";
import { defineConfig, env } from "prisma/config";

// Prisma v7 requires connection URLs to be moved into prisma.config.ts
// See: https://pris.ly/d/config-datasource
export default defineConfig({
  engine: "classic",
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    // Move the DATABASE_URL into the configuration used by migrate/generate
    // The runtime PrismaClient uses an adapter; this is the migration/runtime split
    url: env("DATABASE_URL"),
  },
});
