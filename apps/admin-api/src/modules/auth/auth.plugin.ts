import fp from "fastify-plugin";
import type { FastifyPluginCallback } from "fastify";
import { verifyAccessToken, type TokenClaims } from "./tokenService.js";
import { findActiveSessionById } from "./session.service.js";

interface AuthPluginOptions {
  publicRoutes?: string[];
}

declare module "fastify" {
  interface FastifyRequest {
    adminUser?: AdminRequestUser;
  }
}

export interface AdminRequestUser {
  id: string;
  role: TokenClaims["role"];
  sessionId: string;
  claims: TokenClaims;
}

const authPlugin: FastifyPluginCallback<AuthPluginOptions> = (
  app,
  options,
  done
) => {
  const publicRoutes = new Set(options.publicRoutes ?? []);

  app.addHook("preHandler", async (request, reply) => {
    const urlPath = request.raw.url ?? "";

    if (
      !urlPath.startsWith("/api") &&
      !urlPath.startsWith("/auth") &&
      !urlPath.startsWith("/health")
    ) {
      return;
    }

    if (publicRoutes.has(request.routerPath ?? "")) {
      return;
    }

    if (request.routerPath?.startsWith("/auth")) {
      return;
    }

    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }

    try {
      const token = authorization.slice("Bearer ".length).trim();
      const claims = await verifyAccessToken(token);
      const session = await findActiveSessionById(claims.sid);

      if (!session || session.adminUserId !== claims.sub) {
        reply.code(401).send({ message: "Unauthorized" });
        return;
      }

      request.adminUser = {
        id: claims.sub,
        role: claims.role,
        sessionId: claims.sid,
        claims,
      };
    } catch (error) {
      request.log.warn({ err: error }, "Failed to verify admin token");
      reply.code(401).send({ message: "Unauthorized" });
      return;
    }
  });

  done();
};

export default fp(authPlugin, {
  name: "auth-plugin",
});
