import argon2 from "argon2";
// AdminConfig is declared in this module

export type ResolvedAdminConfig = AdminConfig & {
  adminPasswordHash?: string;
  adminPasswordPlain?: undefined;
  enabled: boolean;
  basePath: string;
};

export async function resolveAdminConfig(
  cfg: AdminConfig
): Promise<ResolvedAdminConfig> {
  let adminPasswordHash = cfg.adminPasswordHash;

  if (!adminPasswordHash && cfg.adminPasswordPlain) {
    adminPasswordHash = await argon2.hash(cfg.adminPasswordPlain);
  }

  const basePath = cfg.basePath?.endsWith("/")
    ? cfg.basePath.slice(0, -1)
    : cfg.basePath ?? "";

  const resolved: ResolvedAdminConfig = {
    ...cfg,
    adminPasswordHash,
    adminPasswordPlain: undefined,
    enabled: Boolean(cfg.enabled && adminPasswordHash),
    basePath,
  };

  return resolved;
}
export interface AdminConfig {
  enabled: boolean;
  adminUsername: string;
  adminPasswordHash?: string;
  adminPasswordPlain?: string;
  jwtSecret: string;
  jwtCookieName: string;
  jwtIssuer: string;
  jwtAudience: string;
  jwtTtlSeconds: number;
  csrfCookieName: string;
  basePath: string;
  cookieSecure: boolean;
}

export function loadAdminConfig(
  env: Record<string, string | undefined>
): AdminConfig {
  const defaultJwtTtlSeconds = 60 * 60 * 24;
  const adminUsername = env.ADMIN_USERNAME ?? "admin";
  const adminPasswordHash = env.ADMIN_PASSWORD_HASH?.trim() ?? "";
  const adminPasswordPlain = env.ADMIN_PASSWORD?.trim() ?? "";
  const jwtSecret = env.ADMIN_JWT_SECRET ?? env.ADMIN_SESSION_SECRET ?? "";
  const jwtCookieName =
    env.ADMIN_JWT_COOKIE ?? env.ADMIN_SESSION_COOKIE ?? "bsuir_admin_auth";
  const parsedJwtTtl = Number.parseInt(
    env.ADMIN_JWT_TTL_SECONDS ?? env.ADMIN_SESSION_TTL_SECONDS ?? "",
    10
  );
  const jwtTtlSeconds =
    Number.isFinite(parsedJwtTtl) && parsedJwtTtl > 0
      ? parsedJwtTtl
      : defaultJwtTtlSeconds;
  const jwtIssuer = env.ADMIN_JWT_ISSUER ?? "bsuir-admin";
  const jwtAudience = env.ADMIN_JWT_AUDIENCE ?? "bsuir-admin";
  const csrfCookieName = env.ADMIN_CSRF_COOKIE ?? "admin_csrf";

  const cookieSecure = (env.NODE_ENV ?? "development") === "production";

  const hasDatabase = Boolean(env.DATABASE_URL);
  const hasPassword = Boolean(adminPasswordHash || adminPasswordPlain);

  return {
    enabled: Boolean(hasPassword && jwtSecret && hasDatabase),
    adminUsername,
    adminPasswordHash: adminPasswordHash || undefined,
    adminPasswordPlain: adminPasswordPlain || undefined,
    jwtSecret,
    jwtCookieName,
    jwtIssuer,
    jwtAudience,
    jwtTtlSeconds,
    csrfCookieName,
    basePath: "/admin",
    cookieSecure,
  };
}
