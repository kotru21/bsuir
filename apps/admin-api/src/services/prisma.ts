import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  __bsuirAdminPrisma?: PrismaClient;
};

export const prisma = globalForPrisma.__bsuirAdminPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__bsuirAdminPrisma = prisma;
}
