import fastifyHelmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import type { ResolvedAdminConfig } from "../config.js";

export async function registerHelmet(instance: FastifyInstance) {
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
}

export async function registerJwt(
  instance: FastifyInstance,
  resolvedConfig: ResolvedAdminConfig
) {
  const jwtPlugin =
    fastifyJwt as unknown as FastifyPluginAsync<fastifyJwt.FastifyJWTOptions>;

  await instance.register(jwtPlugin, {
    secret: resolvedConfig.jwtSecret,
    sign: {
      expiresIn: resolvedConfig.jwtTtlSeconds,
      iss: resolvedConfig.jwtIssuer,
      aud: resolvedConfig.jwtAudience,
    },
    verify: {
      allowedIss: resolvedConfig.jwtIssuer,
      allowedAud: resolvedConfig.jwtAudience,
    },
    cookie: {
      cookieName: resolvedConfig.jwtCookieName,
      signed: false,
    },
  });
}
