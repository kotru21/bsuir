import fp from "fastify-plugin";
import { password as bunPassword } from "bun";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { randomBytes } from "node:crypto";
import type { AdminConfig } from "../config.js";

export interface AuthenticationPluginOptions {
  config: AdminConfig;
}

const CSRF_HEADER = "x-csrf-token";

interface AdminSessionState {
  username: string;
  xsrfToken: string;
}

async function verifyCredentials(
  instance: FastifyInstance,
  config: AdminConfig,
  username: string,
  password: string
): Promise<boolean> {
  if (username !== config.adminUsername) {
    return false;
  }

  if (!config.adminPasswordHash) {
    instance.log.error("Admin password is not configured.");
    return false;
  }

  try {
    return await bunPassword.verify(password, config.adminPasswordHash);
  } catch (err) {
    instance.log.error({ err }, "Failed to verify admin credentials");
    return false;
  }
}

function getCsrfTokenFromBody(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }
  const candidate = (body as Record<string, unknown>).csrfToken;
  return typeof candidate === "string" ? candidate : undefined;
}

async function resolveAdminSession(
  app: FastifyInstance,
  request: FastifyRequest,
  config: AdminConfig
): Promise<AdminSessionState | null> {
  if (request.adminSession !== undefined) {
    return request.adminSession ?? null;
  }

  const token = request.cookies?.[config.jwtCookieName];
  if (!token) {
    request.adminSession = null;
    return null;
  }

  try {
    const payload = await app.jwt.verify<AdminSessionState>(token);
    if (
      !payload ||
      typeof payload.username !== "string" ||
      typeof payload.xsrfToken !== "string"
    ) {
      request.adminSession = null;
      return null;
    }
    request.adminSession = {
      username: payload.username,
      xsrfToken: payload.xsrfToken,
    };
    return request.adminSession;
  } catch (err) {
    request.log.warn({ err }, "Failed to verify admin JWT");
    request.adminSession = null;
    return null;
  }
}

function decorateAuth(app: FastifyInstance, config: AdminConfig): void {
  app.decorate(
    "verifyAdminCredentials",
    async (username: string, password: string) =>
      verifyCredentials(app, config, username, password)
  );

  app.decorateRequest(
    "getAdminSession",
    async function getAdminSession(this: FastifyRequest) {
      return resolveAdminSession(app, this, config);
    }
  );

  app.decorateRequest(
    "requireAdminAuth",
    async function requireAdminAuth(this: FastifyRequest) {
      const session = await resolveAdminSession(app, this, config);
      if (!session) {
        throw app.httpErrors.unauthorized("Authentication required");
      }
      return session;
    }
  );

  app.decorateReply(
    "setAdminSession",
    async function setAdminSession(
      this: FastifyReply,
      username: string,
      xsrfToken: string
    ) {
      const token = await app.jwt.sign({ username, xsrfToken });
      this.setCookie(config.jwtCookieName, token, {
        secure: config.cookieSecure,
        httpOnly: true,
        sameSite: "lax",
        path: config.basePath,
        maxAge: config.jwtTtlSeconds,
      });
      if (this.request) {
        this.request.adminSession = { username, xsrfToken };
      }
    }
  );

  app.decorateReply(
    "clearAdminSession",
    function clearAdminSession(this: FastifyReply) {
      this.clearCookie(config.jwtCookieName, {
        path: config.basePath,
      });
      if (this.request) {
        this.request.adminSession = null;
      }
    }
  );

  app.decorateRequest(
    "issueAdminCsrfToken",
    function issueAdminCsrfToken(this: FastifyRequest) {
      return randomBytes(32).toString("hex");
    }
  );

  app.decorateRequest(
    "verifyAdminCsrfToken",
    function verifyAdminCsrfToken(this: FastifyRequest) {
      const cookieToken = this.cookies?.[config.csrfCookieName];
      const headerToken = this.headers[CSRF_HEADER] as string | undefined;
      const bodyToken = getCsrfTokenFromBody(this.body);
      const presented = headerToken ?? bodyToken;

      if (!cookieToken || !presented || cookieToken !== presented) {
        throw app.httpErrors.forbidden("Invalid CSRF token");
      }

      if (
        this.adminSession &&
        this.adminSession.xsrfToken &&
        this.adminSession.xsrfToken !== presented
      ) {
        throw app.httpErrors.forbidden("Stale CSRF token");
      }
    }
  );
}

export default fp<AuthenticationPluginOptions>(
  async (app: FastifyInstance, opts: AuthenticationPluginOptions) => {
    decorateAuth(app, opts.config);
  }
);
