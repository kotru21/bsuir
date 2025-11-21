import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import sessionExtension from "./prismaExtensions.js";

let prisma: PrismaClient | null = null;

export type PrismaClientInstance = PrismaClient;

function ensurePrisma(): PrismaClientInstance {
  if (!prisma) {
    // Prisma v7 requires passing an adapter (e.g., PrismaPg) for PostgreSQL.
    // Use DATABASE_URL from environment and pass the adapter to PrismaClient.
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    const base = new PrismaClient({ adapter });

    prisma = base.$extends(sessionExtension) as unknown as PrismaClient;
  }
  return prisma;
}

export async function connectPrisma(): Promise<void> {
  await ensurePrisma().$connect();
}

export function getPrismaClient(): PrismaClientInstance {
  return ensurePrisma();
}

export async function disconnectPrisma(): Promise<void> {
  if (!prisma) {
    return;
  }
  await prisma
    .$disconnect()
    .catch((err: unknown) => {
      console.error("Failed to disconnect Prisma client", err);
    })
    .finally(() => {
      prisma = null;
    });
}
