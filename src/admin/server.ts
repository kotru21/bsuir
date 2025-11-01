import path from "node:path";
import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import fastifyStatic from "@fastify/static";
import fastifyHelmet from "@fastify/helmet";
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

  if (config.sessionSecret.length < 32) {
    instance.log.warn(
      "Admin session secret should be at least 32 characters for security."
    );
  }

  await instance.register(fastifyHelmet, {
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  });

  await instance.register(fastifySensible);

  if (!config.enabled) {
    instance.log.warn(
      "Admin panel is disabled. Ensure DATABASE_URL, ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET are configured."
    );

    instance.get("/", async () => ({
      status: "admin-disabled",
      reason: "Admin panel is not configured.",
    }));

    instance.get(`${config.basePath}/*`, async () => ({
      status: "admin-disabled",
      reason: "Admin panel is not configured.",
    }));

    return instance;
  }

  await instance.register(fastifyCookie, {
    hook: "onRequest",
  });

  await instance.register(fastifySession, {
    secret: config.sessionSecret,
    cookieName: config.sessionCookieName,
    cookie: {
      secure: config.cookieSecure,
      httpOnly: true,
      sameSite: "lax",
      path: config.basePath,
      maxAge: config.sessionTtlSeconds,
    },
    rolling: true,
    saveUninitialized: false,
  });

  await instance.register(authenticationPlugin, { config });

  const staticRoot = path.resolve(process.cwd(), "dist", "admin");
  await instance.register(fastifyStatic, {
    root: staticRoot,
    prefix: `${config.basePath}/assets/`,
    decorateReply: false,
    index: false,
  });

  await registerAdminRoutes(instance, {
    config,
    staticRoot,
  });

  return instance;
}
