import fp from "fastify-plugin";
import type { FastifyPluginCallback } from "fastify";
import { verifyAccessToken } from "./tokenService.js";

interface AuthPluginOptions {
  publicRoutes?: string[];
}

declare module "fastify" {
  interface FastifyRequest {
    adminUser?: Awaited<ReturnType<typeof verifyAccessToken>>;
  }
}

const authPlugin: FastifyPluginCallback<AuthPluginOptions> = (
  app,
  options,
  done
) => {
  const publicRoutes = new Set(options.publicRoutes ?? []);

  app.addHook("preHandler", async (request, reply) => {
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
      request.adminUser = await verifyAccessToken(token);
    } catch (error) {
      request.log.warn({ err: error }, "Failed to verify admin token");
      reply.code(401).send({ message: "Unauthorized" });
    }
  });

  done();
};

export default fp(authPlugin, {
  name: "auth-plugin",
});
