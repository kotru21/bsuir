import fastify from "fastify";
import { resolveAdminConfig } from "./config.js";
import { registerCorePlugins, registerCookiePlugin } from "./plugins/core.js";
import { registerHelmet, registerJwt } from "./plugins/security.js";
import { registerStaticFiles } from "./plugins/static.js";
import type { FastifyInstance } from "fastify";
import type { AdminConfig } from "./config.js";
import authenticationPlugin from "./plugins/authentication.js";
import { registerAdminRoutes } from "./routes/index.js";

export interface BuildAdminServerOptions {
  config: AdminConfig;
  trustProxy?: boolean;
  rootDir?: string;
}

export async function buildAdminServer(
  options: BuildAdminServerOptions
): Promise<FastifyInstance> {
  const { config, trustProxy = true } = options;

  const instance = fastify({
    trustProxy,
    logger: { level: process.env.LOG_LEVEL ?? "info" },
  });

  const resolvedConfig = await resolveAdminConfig(config);

  // Inform about password hash derivation (preserve previous behaviour)
  if (!config.adminPasswordHash && config.adminPasswordPlain) {
    instance.log.info(
      "Generated admin password hash from plain password env variable."
    );
  }

  if (config.adminPasswordHash && config.adminPasswordPlain) {
    instance.log.warn(
      "Both ADMIN_PASSWORD_HASH and ADMIN_PASSWORD provided; using the precomputed hash."
    );
  }

  if (resolvedConfig.jwtSecret.length < 32) {
    instance.log.warn(
      "Admin JWT secret should be at least 32 characters for security."
    );
  }
  await registerHelmet(instance);

  await registerCorePlugins(instance);

  if (!resolvedConfig.enabled) {
    instance.log.warn(
      "Admin panel is disabled. Ensure DATABASE_URL, ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH) and ADMIN_JWT_SECRET are configured."
    );

    const disabledResponse = {
      status: "admin-disabled",
      reason: "Admin panel is not configured.",
    } as const;

    const basePath = resolvedConfig.basePath.endsWith("/")
      ? resolvedConfig.basePath.slice(0, -1)
      : resolvedConfig.basePath;

    instance.get("/", async () => ({
      ...disabledResponse,
    }));

    if (basePath && basePath !== "/") {
      instance.get(basePath, async () => ({
        ...disabledResponse,
      }));

      instance.get(`${basePath}/`, async () => ({
        ...disabledResponse,
      }));

      instance.get(`${basePath}/*`, async () => ({
        ...disabledResponse,
      }));
    } else {
      instance.get("/*", async () => ({
        ...disabledResponse,
      }));
    }

    return instance;
  }

  await registerCookiePlugin(instance);

  await registerJwt(instance, resolvedConfig);

  // Security (JWT / Helmet) already registered by `registerSecurity`

  await instance.register(authenticationPlugin, { config: resolvedConfig });

  const { staticRoot } = await registerStaticFiles(
    instance,
    resolvedConfig.basePath,
    options.rootDir
  );

  await registerAdminRoutes(instance, {
    config: resolvedConfig,
    staticRoot,
  });

  return instance;
}
