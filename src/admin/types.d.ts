import type {
  FastifyInstance as FastifyInstanceBase,
  FastifyReply as FastifyReplyBase,
  FastifyRequest as FastifyRequestBase,
} from "fastify";

interface AdminSessionState {
  username: string;
  xsrfToken: string;
}

declare module "fastify" {
  interface FastifyRequest extends FastifyRequestBase {
    adminSession?: AdminSessionState | null;
    getAdminSession: () => Promise<AdminSessionState | null>;
    requireAdminAuth: () => Promise<AdminSessionState>;
    issueAdminCsrfToken: () => string;
    verifyAdminCsrfToken: () => void;
  }

  interface FastifyReply extends FastifyReplyBase {
    setAdminSession: (username: string, xsrfToken: string) => Promise<void>;
    clearAdminSession: () => void;
  }

  interface FastifyInstance extends FastifyInstanceBase {
    verifyAdminCredentials: (
      username: string,
      password: string
    ) => Promise<boolean>;
  }
}
