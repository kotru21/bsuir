import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient | null = null;

export type PrismaClientInstance = PrismaClient;

function ensurePrisma(): PrismaClientInstance {
  if (!prisma) {
    // Prisma v7: create a Postgres adapter at runtime to provide the connection URL
    if (process.env.DATABASE_URL) {
      const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL,
      });
      prisma = new PrismaClient({ adapter });
    } else {
      prisma = new PrismaClient();
    }
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
