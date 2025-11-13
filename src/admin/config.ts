export interface AdminConfig {
  enabled: boolean;
  adminUsername: string;
  adminPasswordHash?: string;
  adminPasswordPlain?: string;
  sessionSecret: string;
  sessionCookieName: string;
  sessionTtlSeconds: number;
  basePath: string;
  cookieSecure: boolean;
}

export function loadAdminConfig(
  env: Record<string, string | undefined>
): AdminConfig {
  const defaultSessionTtlSeconds = 60 * 60 * 24;
  const adminUsername = env.ADMIN_USERNAME ?? "admin";
  const adminPasswordHash = env.ADMIN_PASSWORD_HASH?.trim() ?? "";
  const adminPasswordPlain = env.ADMIN_PASSWORD?.trim() ?? "";
  const sessionSecret = env.ADMIN_SESSION_SECRET ?? "";
  const sessionCookieName = env.ADMIN_SESSION_COOKIE ?? "bsuir_admin_sid";
  const parsedSessionTtl = Number.parseInt(
    env.ADMIN_SESSION_TTL_SECONDS ?? "",
    10
  );
  const sessionTtlSeconds =
    Number.isFinite(parsedSessionTtl) && parsedSessionTtl > 0
      ? parsedSessionTtl
      : defaultSessionTtlSeconds;

  const cookieSecure = (env.NODE_ENV ?? "development") === "production";

  const hasDatabase = Boolean(env.DATABASE_URL);
  const hasPassword = Boolean(adminPasswordHash || adminPasswordPlain);

  return {
    enabled: Boolean(hasPassword && sessionSecret && hasDatabase),
    adminUsername,
    adminPasswordHash: adminPasswordHash || undefined,
    adminPasswordPlain: adminPasswordPlain || undefined,
    sessionSecret,
    sessionCookieName,
    sessionTtlSeconds,
    basePath: "/admin",
    cookieSecure,
  };
}
