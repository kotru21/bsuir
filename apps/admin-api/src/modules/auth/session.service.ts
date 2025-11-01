import { createHash, randomBytes } from "node:crypto";
import { loadEnv } from "../../config/env.js";
import { prisma } from "../../services/prisma.js";

const env = loadEnv();
export const SESSION_TTL_MS = env.ADMIN_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_BYTES = 48;

function computeExpiresAt(): Date {
  return new Date(Date.now() + SESSION_TTL_MS);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function generateRefreshToken(): string {
  return randomBytes(REFRESH_TOKEN_BYTES).toString("base64url");
}

export interface SessionWithUser {
  id: string;
  adminUserId: string;
  tokenId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  adminUser: {
    id: string;
    username: string;
    role: string;
  };
}

export interface CreatedSession {
  session: SessionWithUser;
  refreshToken: string;
}

export async function createAdminSession(
  adminUserId: string
): Promise<CreatedSession> {
  const refreshToken = generateRefreshToken();
  const tokenId = hashToken(refreshToken);
  const expiresAt = computeExpiresAt();

  const session = await prisma.adminSession.create({
    data: {
      adminUserId,
      tokenId,
      expiresAt,
    },
    include: {
      adminUser: true,
    },
  });

  return { session, refreshToken };
}

export async function rotateAdminSession(
  refreshToken: string
): Promise<CreatedSession | null> {
  const tokenId = hashToken(refreshToken);

  const existing = await prisma.adminSession.findUnique({
    where: { tokenId },
    include: { adminUser: true },
  });

  if (!existing) {
    return null;
  }

  if (existing.revokedAt) {
    return null;
  }

  if (existing.expiresAt.getTime() <= Date.now()) {
    await prisma.adminSession.update({
      where: { id: existing.id },
      data: { revokedAt: existing.revokedAt ?? new Date() },
    });
    return null;
  }

  const nextRefreshToken = generateRefreshToken();
  const nextTokenId = hashToken(nextRefreshToken);
  const nextExpiresAt = computeExpiresAt();

  const updated = await prisma.adminSession.update({
    where: { id: existing.id },
    data: {
      tokenId: nextTokenId,
      expiresAt: nextExpiresAt,
      revokedAt: null,
    },
    include: {
      adminUser: true,
    },
  });

  return {
    session: updated,
    refreshToken: nextRefreshToken,
  };
}

export async function revokeAdminSession(refreshToken: string): Promise<void> {
  const tokenId = hashToken(refreshToken);

  const session = await prisma.adminSession.findUnique({ where: { tokenId } });

  if (!session) {
    return;
  }

  await prisma.adminSession.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });
}

export async function findActiveSessionById(
  sessionId: string
): Promise<SessionWithUser | null> {
  const session = await prisma.adminSession.findUnique({
    where: { id: sessionId },
    include: { adminUser: true },
  });

  if (!session) {
    return null;
  }

  if (session.revokedAt) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return session;
}
