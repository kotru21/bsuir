import argon2 from "argon2";
import { prisma } from "./prisma.js";
import { loadEnv } from "../config/env.js";

export async function ensureBootstrapAdmin(): Promise<void> {
  const { ADMIN_BOOTSTRAP_USERNAME, ADMIN_BOOTSTRAP_PASSWORD } = loadEnv();

  if (!ADMIN_BOOTSTRAP_USERNAME || !ADMIN_BOOTSTRAP_PASSWORD) {
    return;
  }

  const passwordHash = await argon2.hash(ADMIN_BOOTSTRAP_PASSWORD);

  await prisma.adminUser.upsert({
    where: { username: ADMIN_BOOTSTRAP_USERNAME },
    update: {
      passwordHash,
      role: "ADMIN",
    },
    create: {
      username: ADMIN_BOOTSTRAP_USERNAME,
      passwordHash,
      role: "ADMIN",
    },
  });
}
