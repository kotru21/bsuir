import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import sessionExtension from "./prismaExtensions.js";

let prisma: PrismaClient | null = null;

export type PrismaClientInstance = PrismaClient;

function ensurePrisma(): PrismaClientInstance {
  if (!prisma) {
    // Prisma v7 requires passing an adapter (e.g., PrismaPg) for PostgreSQL.
    // Use DATABASE_URL from environment and pass the adapter to PrismaClient.
    // allow adapter to be typed as any — Prisma v7 adapter types may differ
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter: any = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    // Prisma v7 expects an adapter; cast to any for type compatibility in this repo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const base = new PrismaClient({ adapter: adapter as any });

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
