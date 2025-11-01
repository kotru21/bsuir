import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type PrismaClientInstance = typeof prisma;

export async function connectPrisma(): Promise<void> {
  await prisma.$connect();
}

export function getPrismaClient(): PrismaClientInstance {
  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect().catch((err: unknown) => {
    console.error("Failed to disconnect Prisma client", err);
  });
}
