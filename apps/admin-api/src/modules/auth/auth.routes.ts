import type { FastifyPluginAsync, FastifyReply } from "fastify";
import argon2 from "argon2";
import { loginRequestSchema, loginResponseSchema } from "@bsuir-admin/types";
import { findAdminUserByUsername } from "./auth.service.js";
import { issueAccessToken, type Role } from "./tokenService.js";
import {
  createAdminSession,
  rotateAdminSession,
  revokeAdminSession,
} from "./session.service.js";
import {
  clearRefreshTokenCookie,
  readRefreshTokenFromCookies,
  setRefreshTokenCookie,
} from "./cookie.js";

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/auth/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", minLength: 3 },
            password: { type: "string", minLength: 8 },
          },
        },
        response: {
          200: sessionResponseJsonSchema,
          401: loginErrorResponseSchema,
        },
      },
    },
    async (request, reply: FastifyReply) => {
      const parsed = loginRequestSchema.safeParse(request.body);

      if (!parsed.success) {
        reply.code(400).send({ message: "Invalid credentials" });
        return;
      }

      const { username, password } = parsed.data;
      const user = await findAdminUserByUsername(username);

      if (!user) {
        await replyUnauthorized(reply);
        return;
      }

      const passwordMatches = await argon2.verify(user.passwordHash, password);

      if (!passwordMatches) {
        await replyUnauthorized(reply);
        return;
      }

      const role = normalizeRole(user.role);
      const { session, refreshToken } = await createAdminSession(user.id);
      const issued = await issueAccessToken({
        subject: user.id,
        role,
        sessionId: session.id,
      });

      setRefreshTokenCookie(reply, refreshToken, session.expiresAt);

      reply.send(
        loginResponseSchema.parse({
          accessToken: issued.token,
          expiresAt: issued.expiresAt.toISOString(),
          user: {
            id: user.id,
            username: user.username,
            role,
          },
        })
      );
    }
  );

  app.post(
    "/auth/refresh",
    {
      schema: {
        response: {
          200: sessionResponseJsonSchema,
          401: loginErrorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const refreshToken = readRefreshTokenFromCookies(request);

      if (!refreshToken) {
        clearRefreshTokenCookie(reply);
        reply.code(401).send({ message: "Unauthorized" });
        return;
      }

      const rotated = await rotateAdminSession(refreshToken);

      if (!rotated) {
        clearRefreshTokenCookie(reply);
        reply.code(401).send({ message: "Unauthorized" });
        return;
      }

      const { session, refreshToken: nextToken } = rotated;
      const role = normalizeRole(session.adminUser.role);

      const issued = await issueAccessToken({
        subject: session.adminUserId,
        role,
        sessionId: session.id,
      });

      setRefreshTokenCookie(reply, nextToken, session.expiresAt);

      reply.send(
        loginResponseSchema.parse({
          accessToken: issued.token,
          expiresAt: issued.expiresAt.toISOString(),
          user: {
            id: session.adminUser.id,
            username: session.adminUser.username,
            role,
          },
        })
      );
    }
  );

  app.post(
    "/auth/logout",
    {
      schema: {
        response: {
          204: { type: "null" },
        },
      },
    },
    async (request, reply) => {
      const refreshToken = readRefreshTokenFromCookies(request);
      if (refreshToken) {
        await revokeAdminSession(refreshToken);
      }

      clearRefreshTokenCookie(reply);
      reply.code(204).send();
    }
  );
};

async function replyUnauthorized(reply: FastifyReply) {
  await reply.code(401).send({ message: "Invalid credentials" });
}

const loginErrorResponseSchema = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
  required: ["message"],
};

function normalizeRole(role: string): Role {
  const normalizedRole = role.toLowerCase();
  return (["admin", "analyst", "support"] as const).includes(
    normalizedRole as Role
  )
    ? (normalizedRole as Role)
    : "admin";
}

const sessionResponseJsonSchema = {
  type: "object",
  properties: {
    accessToken: { type: "string" },
    expiresAt: { type: "string", format: "date-time" },
    user: {
      type: "object",
      properties: {
        id: { type: "string" },
        username: { type: "string" },
        role: { type: "string" },
      },
      required: ["id", "username", "role"],
    },
  },
  required: ["accessToken", "expiresAt", "user"],
};
