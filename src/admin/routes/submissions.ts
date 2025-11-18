import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { AdminConfig } from "../config.js";
import { getSubmissionPage } from "../services/statisticsService.js";

export interface RegisterSubmissionRoutesOptions {
  config: AdminConfig;
}

const paginationSchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((value: string | undefined) =>
        value ? Math.max(1, Number.parseInt(value, 10)) : 1
      ),
    pageSize: z
      .string()
      .optional()
      .transform((value: string | undefined) =>
        value ? Math.min(100, Math.max(5, Number.parseInt(value, 10))) : 25
      ),
  })
  .transform((data: { page: number; pageSize: number }) => ({
    page: data.page,
    pageSize: data.pageSize,
  }));

export async function registerSubmissionRoutes(
  app: FastifyInstance,
  options: RegisterSubmissionRoutesOptions
): Promise<void> {
  const { config } = options;
  const prefix = `${config.basePath}/api`;

  app.get(
    `${prefix}/submissions`,
    async (request: FastifyRequest, reply: FastifyReply) => {
      await request.requireAdminAuth();
      const parseResult = paginationSchema.safeParse(request.query);
      if (!parseResult.success) {
        reply.status(400);
        return { error: "Invalid pagination parameters" };
      }

      const { page, pageSize } = parseResult.data;
      const { items, total } = await getSubmissionPage(page, pageSize);
      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      return {
        items,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
        },
      };
    }
  );
}
