import path from "node:path";
import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import fastifyStatic from "@fastify/static";
import fastifyHelmet from "@fastify/helmet";
import argon2 from "argon2";
import fastifySensible from "@fastify/sensible";
import type { FastifyInstance } from "fastify";
import type { AdminConfig } from "./config.js";
import authenticationPlugin from "./plugins/authentication.js";
import { registerAdminRoutes } from "./routes/index.js";

export interface BuildAdminServerOptions {
  config: AdminConfig;
  trustProxy?: boolean;
}

export async function buildAdminServer(
  options: BuildAdminServerOptions
): Promise<FastifyInstance> {
  const { config, trustProxy = true } = options;

  const instance = fastify({
    trustProxy,
    logger: { level: process.env.LOG_LEVEL ?? "info" },
  });

  let passwordHash = config.adminPasswordHash;
  if (!passwordHash && config.adminPasswordPlain) {
    try {
      passwordHash = await argon2.hash(config.adminPasswordPlain);
      instance.log.info(
        "Generated admin password hash from plain password env variable."
      );
    } catch (err) {
      instance.log.error({ err }, "Failed to derive admin password hash");
    }
  }

  if (passwordHash && config.adminPasswordHash && config.adminPasswordPlain) {
    instance.log.warn(
      "Both ADMIN_PASSWORD_HASH and ADMIN_PASSWORD provided; using the precomputed hash."
    );
  }

  const resolvedConfig: AdminConfig = {
    ...config,
    adminPasswordHash: passwordHash,
    adminPasswordPlain: undefined,
    enabled: Boolean(config.enabled && passwordHash),
  };

  if (resolvedConfig.sessionSecret.length < 32) {
    instance.log.warn(
      "Admin session secret should be at least 32 characters for security."
    );
  }

  await instance.register(fastifyHelmet, {
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc:
          (process.env.NODE_ENV ?? "development") === "production"
            ? ["'self'"]
            : ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
  });

  await instance.register(fastifySensible);

  if (!resolvedConfig.enabled) {
    instance.log.warn(
      "Admin panel is disabled. Ensure DATABASE_URL, ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH) and ADMIN_SESSION_SECRET are configured."
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

  await instance.register(fastifyCookie, {
    hook: "onRequest",
  });

  await instance.register(fastifySession, {
    secret: resolvedConfig.sessionSecret,
    cookieName: resolvedConfig.sessionCookieName,
    cookie: {
      secure: resolvedConfig.cookieSecure,
      httpOnly: true,
      sameSite: "lax",
      path: resolvedConfig.basePath,
      maxAge: resolvedConfig.sessionTtlSeconds,
    },
    rolling: true,
    saveUninitialized: false,
  });

  await instance.register(authenticationPlugin, { config: resolvedConfig });

  const staticRoot = path.resolve(process.cwd(), "dist", "admin");
  const assetsRoot = path.join(staticRoot, "assets");

  await instance.register(fastifyStatic, {
    root: assetsRoot,
    prefix: `${resolvedConfig.basePath}/assets/`,
    decorateReply: false,
    index: false,
  });

  await registerAdminRoutes(instance, {
    config: resolvedConfig,
    staticRoot,
  });

  return instance;
}
