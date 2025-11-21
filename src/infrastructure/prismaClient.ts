import { PrismaClient } from "../generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient | null = null;

export type PrismaClientInstance = PrismaClient;

function ensurePrisma(): PrismaClientInstance {
  if (!prisma) {
    const connectionString = process.env.DATABASE_URL;

    if (connectionString) {
      process.env.DATABASE_URL = connectionString;
      prisma = new PrismaClient({
        adapter: new PrismaPg({ connectionString }),
      } as unknown as ConstructorParameters<typeof PrismaClient>[0]);
    } else {
      prisma = new PrismaClient({
        adapter: new PrismaPg({}),
      } as unknown as ConstructorParameters<typeof PrismaClient>[0]);
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
