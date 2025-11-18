import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { AdminConfig } from "../config.js";
import {
  getDemographicStats,
  getOverviewStats,
  getTimelineStats,
} from "../services/statisticsService.js";

export interface RegisterStatsRoutesOptions {
  config: AdminConfig;
}

const timelineQuerySchema = z
  .object({
    rangeDays: z
      .string()
      .optional()
      .transform((value: string | undefined) =>
        value ? Number.parseInt(value, 10) : 30
      )
      .pipe(z.number().min(1).max(365)),
  })
  .transform((data: { rangeDays: number }) => ({ rangeDays: data.rangeDays }));

export async function registerStatsRoutes(
  app: FastifyInstance,
  options: RegisterStatsRoutesOptions
): Promise<void> {
  const { config } = options;
  const prefix = `${config.basePath}/api/stats`;

  app.get(`${prefix}/overview`, async (request: FastifyRequest) => {
    await request.requireAdminAuth();
    const data = await getOverviewStats();
    return data;
  });

  app.get(`${prefix}/demographics`, async (request: FastifyRequest) => {
    await request.requireAdminAuth();
    const data = await getDemographicStats();
    return data;
  });

  app.get(
    `${prefix}/timeline`,
    async (request: FastifyRequest, reply: FastifyReply) => {
      await request.requireAdminAuth();
      const parseResult = timelineQuerySchema.safeParse(request.query);
      if (!parseResult.success) {
        reply.status(400);
        return { error: "Invalid query parameters" };
      }
      const { rangeDays } = parseResult.data;
      const points = await getTimelineStats(rangeDays);
      return { points };
    }
  );
}
