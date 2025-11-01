export interface AdminConfig {
  enabled: boolean;
  adminUsername: string;
  adminPasswordHash: string;
  sessionSecret: string;
  sessionCookieName: string;
  sessionTtlSeconds: number;
  basePath: string;
  cookieSecure: boolean;
}

export function loadAdminConfig(
  env: Record<string, string | undefined>
): AdminConfig {
  const adminUsername = env.ADMIN_USERNAME ?? "admin";
  const adminPasswordHash = env.ADMIN_PASSWORD_HASH ?? "";
  const sessionSecret = env.ADMIN_SESSION_SECRET ?? "";
  const sessionCookieName = env.ADMIN_SESSION_COOKIE ?? "bsuir_admin_sid";

  const cookieSecure = (env.NODE_ENV ?? "development") === "production";

  const hasDatabase = Boolean(env.DATABASE_URL);

  return {
    enabled: Boolean(adminPasswordHash && sessionSecret && hasDatabase),
    adminUsername,
    adminPasswordHash,
    sessionSecret,
    sessionCookieName,
    sessionTtlSeconds: 60 * 60 * 8,
    basePath: "/admin",
    cookieSecure,
  };
}
