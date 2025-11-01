import "@fastify/session";
import type {
  FastifyInstance as FastifyInstanceBase,
  FastifyReply as FastifyReplyBase,
  FastifyRequest as FastifyRequestBase,
} from "fastify";
import type { FastifySessionObject } from "@fastify/session";

declare module "@fastify/session" {
  interface SessionData {
    adminAuthenticated?: boolean;
    adminUsername?: string;
    adminCsrfToken?: string;
  }

  interface FastifySessionObject {
    adminAuthenticated?: boolean;
    adminUsername?: string;
    adminCsrfToken?: string;
  }
}

declare module "fastify" {
  interface FastifyRequest extends FastifyRequestBase {
    requireAdminAuth: () => void;
    issueAdminCsrfToken: () => string;
    verifyAdminCsrfToken: () => void;
    session: FastifySessionObject | undefined;
  }

  interface FastifyReply extends FastifyReplyBase {
    clearAdminSession: () => void;
  }

  interface FastifyInstance extends FastifyInstanceBase {
    verifyAdminCredentials: (
      username: string,
      password: string
    ) => Promise<boolean>;
  }
}
