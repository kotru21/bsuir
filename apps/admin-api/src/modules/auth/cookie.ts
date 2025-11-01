import type { FastifyReply } from "fastify";
import { loadEnv } from "../../config/env.js";
import { SESSION_TTL_MS } from "./session.service.js";

const env = loadEnv();
const cookieName = env.ADMIN_SESSION_COOKIE_NAME;

const defaultCookieOptions = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  path: "/auth",
  secure: env.ADMIN_COOKIE_SECURE ?? env.NODE_ENV === "production",
  domain: env.ADMIN_COOKIE_DOMAIN,
};

export function setRefreshTokenCookie(
  reply: FastifyReply,
  token: string,
  expiresAt: Date
) {
  const maxAgeSeconds = Math.floor(SESSION_TTL_MS / 1000);

  reply.setCookie(cookieName, token, {
    ...defaultCookieOptions,
    // Fastify expects milliseconds for expires but seconds for maxAge
    expires: expiresAt,
    maxAge: maxAgeSeconds,
  });
}

export function clearRefreshTokenCookie(reply: FastifyReply) {
  reply.clearCookie(cookieName, {
    ...defaultCookieOptions,
    expires: new Date(0),
  });
}

export function readRefreshTokenFromCookies(request: {
  cookies: Record<string, string | undefined>;
}): string | null {
  const raw = request.cookies?.[cookieName];
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}
