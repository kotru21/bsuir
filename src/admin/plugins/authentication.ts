import fp from "fastify-plugin";
import argon2 from "argon2";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { randomBytes } from "node:crypto";
import type { AdminConfig } from "../config.js";

export interface AuthenticationPluginOptions {
  config: AdminConfig;
}

const CSRF_HEADER = "x-csrf-token";
const CSRF_SESSION_KEY = "adminCsrfToken";

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
    return await argon2.verify(config.adminPasswordHash, password);
  } catch (err) {
    instance.log.error({ err }, "Failed to verify admin credentials");
    return false;
  }
}

function destroySession(request: FastifyRequest): void {
  if (!request.session) {
    return;
  }

  request.session.adminAuthenticated = false;
  request.session.adminUsername = undefined;
  request.session[CSRF_SESSION_KEY] = undefined;

  request.session.destroy((err: unknown) => {
    if (err) {
      request.log.error({ err }, "Failed to destroy session");
    }
  });
}

function decorateAuth(app: FastifyInstance, config: AdminConfig): void {
  app.decorate(
    "verifyAdminCredentials",
    async (username: string, password: string) =>
      verifyCredentials(app, config, username, password)
  );

  app.decorateRequest(
    "requireAdminAuth",
    function requireAdminAuth(this: FastifyRequest) {
      if (!this.session?.adminAuthenticated) {
        throw app.httpErrors.unauthorized("Authentication required");
      }
    }
  );

  app.decorateReply(
    "clearAdminSession",
    function clearAdminSession(this: FastifyReply) {
      destroySession(this.request);
    }
  );

  app.decorateRequest(
    "issueAdminCsrfToken",
    function issueAdminCsrfToken(this: FastifyRequest) {
      const token = randomBytes(32).toString("hex");
      if (this.session) {
        this.session[CSRF_SESSION_KEY] = token;
      }
      return token;
    }
  );

  app.decorateRequest(
    "verifyAdminCsrfToken",
    function verifyAdminCsrfToken(this: FastifyRequest) {
      const sessionToken = this.session?.[CSRF_SESSION_KEY];
      if (!sessionToken) {
        throw app.httpErrors.forbidden("Missing CSRF token");
      }

      const headerToken = this.headers[CSRF_HEADER] as string | undefined;
      const bodyToken =
        typeof this.body === "object" && this.body !== null
          ? (this.body as Record<string, unknown>).csrfToken
          : undefined;
      const presented = headerToken ?? (bodyToken as string | undefined);
      if (!presented || presented !== sessionToken) {
        throw app.httpErrors.forbidden("Invalid CSRF token");
      }
    }
  );
}

export default fp<AuthenticationPluginOptions>(
  async (app: FastifyInstance, opts: AuthenticationPluginOptions) => {
    decorateAuth(app, opts.config);
  }
);
