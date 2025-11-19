import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { AdminConfig } from "../config.js";

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
  reply.setCookie(config.csrfCookieName, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: config.cookieSecure,
    path: config.basePath,
    maxAge: config.jwtTtlSeconds,
  });
}

function clearCsrfCookie(reply: FastifyReply, config: AdminConfig): void {
  reply.clearCookie(config.csrfCookieName, {
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
      // If an admin session exists, reuse its XSRF token so it stays
      // consistent with the JWT payload. Generating a fresh token here
      // while a session exists would make the token in the cookie differ
      // from the token stored in the JWT and trigger a stale-token
      // rejection on stateful operations like logout.
      const session = await request.getAdminSession();
      const token = session?.xsrfToken ?? request.issueAdminCsrfToken();
      setCsrfCookie(reply, config, token);
      return { token };
    }
  );

  app.get(`${prefix}/session`, async (request: FastifyRequest) => {
    const session = await request.getAdminSession();
    return {
      authenticated: Boolean(session),
      username: session?.username ?? null,
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
      const cookieToken = request.cookies?.[config.csrfCookieName];
      if (!cookieToken || cookieToken !== csrfToken) {
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

      const freshToken = request.issueAdminCsrfToken();
      await reply.setAdminSession(username, freshToken);
      setCsrfCookie(reply, config, freshToken);

      return { success: true };
    }
  );

  app.post(
    `${prefix}/logout`,
    async (request: FastifyRequest, reply: FastifyReply) => {
      await request.requireAdminAuth();
      request.verifyAdminCsrfToken();
      reply.clearAdminSession();
      clearCsrfCookie(reply, config);
      return { success: true };
    }
  );
}
