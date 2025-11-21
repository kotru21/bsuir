import { PrismaClient } from "../generated/prisma/client/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

type NodeProcessLike = {
  env?: Record<string, string | undefined>;
};

const nodeProcess = (
  globalThis as typeof globalThis & { process?: NodeProcessLike }
).process;

const runtimeEnv =
  (typeof Bun !== "undefined" ? Bun.env : nodeProcess?.env) ?? {};

const accelerateEnabled = Boolean(runtimeEnv.PRISMA_ACCELERATE_URL);

let prisma: PrismaClient | null = null;

export type PrismaClientInstance = PrismaClient;

function ensurePrisma(): PrismaClientInstance {
  if (!prisma) {
    prisma = createClient();
  }
  return prisma;
}

function createClient(): PrismaClientInstance {
  const connectionString = runtimeEnv.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not configured. Set it before accessing Prisma."
    );
  }

  const adapter = new PrismaPg({
    connectionString,
    ssl:
      runtimeEnv.DATABASE_SSL === "true"
        ? {
            rejectUnauthorized:
              runtimeEnv.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
          }
        : undefined,
  });

  const baseClient = new PrismaClient({ adapter });
  if (accelerateEnabled && nodeProcess?.env) {
    nodeProcess.env.PRISMA_ACCELERATE_URL = runtimeEnv.PRISMA_ACCELERATE_URL;
  }
  if (accelerateEnabled) {
    return baseClient.$extends(
      withAccelerate()
    ) as unknown as PrismaClientInstance;
  }
  return baseClient;
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
