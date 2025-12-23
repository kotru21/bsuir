import { z } from "zod";
import type { AdminConfig } from "../config.js";
import type { AdminRouter } from "../http/types.js";
import { buildAdminApiPath } from "../http/pathUtils.js";
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
  router: AdminRouter,
  options: RegisterStatsRoutesOptions
): Promise<void> {
  const { config } = options;
  const statsPath = (suffix: string) =>
    buildAdminApiPath(config.basePath, `/stats${suffix}`);

  router.get(statsPath("/overview"), async (ctx) => {
    await ctx.requireAdminAuth();
    const data = await getOverviewStats();
    return ctx.json(data);
  });

  router.get(statsPath("/demographics"), async (ctx) => {
    await ctx.requireAdminAuth();
    const data = await getDemographicStats();
    return ctx.json(data);
  });

  router.get(statsPath("/timeline"), async (ctx) => {
    await ctx.requireAdminAuth();
    const parseResult = timelineQuerySchema.safeParse(ctx.query);
    if (!parseResult.success) {
      return ctx.json({ error: "Invalid query parameters" }, 400);
    }
    const { rangeDays } = parseResult.data;
    const points = await getTimelineStats(rangeDays);
    return ctx.json({ points });
  });

  // Export overview stats
  router.get(statsPath("/export"), async (ctx) => {
    await ctx.requireAdminAuth();
    const querySchema = z
      .object({ format: z.enum(["json", "csv", "xlsx"]).optional() })
      .transform((d) => ({ format: d.format ?? "json" }));

    const parseResult = querySchema.safeParse(ctx.query);
    if (!parseResult.success) {
      return ctx.json({ error: "Invalid format parameter" }, 400);
    }

    const { format } = parseResult.data;

    try {
      const data = await getOverviewStats();
      const { exportOverview } = await import("../services/statisticsService.js");
      const { buffer, filename, contentType } = await exportOverview(format, data);
      const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      const body = new Uint8Array(arrayBuffer as ArrayBuffer);

      return new Response(body, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } catch (err) {
      ctx.logError(err, "Failed to export overview stats");
      return ctx.json({ error: "Failed to export overview stats" }, 500);
    }
  });
}
