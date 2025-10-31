import { prisma } from "./prisma.js";
import { loadEnv } from "../config/env.js";

export async function ensureBootstrapAdmin(): Promise<void> {
  const { ADMIN_BOOTSTRAP_USERNAME, ADMIN_BOOTSTRAP_PASSWORD_HASH } = loadEnv();

  if (!ADMIN_BOOTSTRAP_USERNAME || !ADMIN_BOOTSTRAP_PASSWORD_HASH) {
    return;
  }

  await prisma.adminUser.upsert({
    where: { username: ADMIN_BOOTSTRAP_USERNAME },
    update: {
      passwordHash: ADMIN_BOOTSTRAP_PASSWORD_HASH,
      role: "ADMIN",
    },
    create: {
      username: ADMIN_BOOTSTRAP_USERNAME,
      passwordHash: ADMIN_BOOTSTRAP_PASSWORD_HASH,
      role: "ADMIN",
    },
  });
}
