import type { FastifyPluginAsync, FastifyReply } from "fastify";
import argon2 from "argon2";
import { loginRequestSchema } from "@bsuir-admin/types";
import { findAdminUserByUsername } from "./auth.service.js";
import { issueAccessToken, type Role } from "./tokenService.js";

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
          200: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
              expiresAt: { type: "string", format: "date-time" },
            },
          },
          401: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
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

      const normalizedRole = user.role.toLowerCase();
      const role: Role = ["admin", "analyst", "support"].includes(
        normalizedRole
      )
        ? (normalizedRole as Role)
        : "admin";
      const issued = await issueAccessToken({ subject: user.id, role });

      reply.send({
        accessToken: issued.token,
        expiresAt: issued.expiresAt.toISOString(),
      });
    }
  );
};

async function replyUnauthorized(reply: FastifyReply) {
  await reply.code(401).send({ message: "Invalid credentials" });
}
