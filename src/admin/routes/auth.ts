import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { AdminConfig } from "../config.js";

const CSRF_COOKIE = "admin_csrf";

export interface RegisterAuthRoutesOptions {
  config: AdminConfig;
}

const loginSchema = z.object({
  username: z.string().min(1).max(128),
  password: z.string().min(1).max(256),
  csrfToken: z.string().min(10),
});

function setCsrfCookie(
  reply: FastifyReply,
  config: AdminConfig,
  token: string
): void {
  reply.setCookie(CSRF_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: config.cookieSecure,
    path: config.basePath,
    maxAge: config.sessionTtlSeconds,
  });
}

function clearCsrfCookie(reply: FastifyReply, config: AdminConfig): void {
  reply.clearCookie(CSRF_COOKIE, {
    path: config.basePath,
  });
}

export async function registerAuthRoutes(
  app: FastifyInstance,
  options: RegisterAuthRoutesOptions
): Promise<void> {
  const { config } = options;
  const prefix = `${config.basePath}/api`;

  app.get(`${prefix}/health`, async () => ({ status: "ok" }));

  app.get(
    `${prefix}/csrf`,
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.issueAdminCsrfToken();
      setCsrfCookie(reply, config, token);
      return { token };
    }
  );

  app.get(`${prefix}/session`, async (request: FastifyRequest) => {
    const authenticated = Boolean(request.session?.adminAuthenticated);
    const username = authenticated
      ? request.session?.adminUsername ?? null
      : null;
    return {
      authenticated,
      username,
    };
  });

  app.post(
    `${prefix}/login`,
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = loginSchema.safeParse(request.body);
      if (!parseResult.success) {
        reply.status(400);
        return { success: false, error: "Invalid payload" };
      }

      const { username, password, csrfToken } = parseResult.data;
      const sessionToken = request.session?.adminCsrfToken;
      if (!sessionToken || sessionToken !== csrfToken) {
        reply.status(403);
        return { success: false, error: "Invalid CSRF token" };
      }

      const valid = await request.server.verifyAdminCredentials(
        username,
        password
      );

      if (!valid) {
        reply.status(401);
        return { success: false, error: "Invalid credentials" };
      }

      if (request.session) {
        request.session.adminAuthenticated = true;
        request.session.adminUsername = username;
      }

      const freshToken = request.issueAdminCsrfToken();
      setCsrfCookie(reply, config, freshToken);

      return { success: true };
    }
  );

  app.post(
    `${prefix}/logout`,
    async (request: FastifyRequest, reply: FastifyReply) => {
      request.requireAdminAuth();
      request.verifyAdminCsrfToken();
      reply.clearAdminSession();
      clearCsrfCookie(reply, config);
      return { success: true };
    }
  );
}
