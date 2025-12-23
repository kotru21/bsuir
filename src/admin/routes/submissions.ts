import { z } from "zod";
import type { AdminConfig } from "../config.js";
import type { AdminRouter } from "../http/types.js";
import { buildAdminApiPath } from "../http/pathUtils.js";
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
  router: AdminRouter,
  options: RegisterSubmissionRoutesOptions
): Promise<void> {
  const { config } = options;
  const submissionsPath = (suffix = "") =>
    buildAdminApiPath(config.basePath, `/submissions${suffix}`);

  router.get(submissionsPath(""), async (ctx) => {
    await ctx.requireAdminAuth();
    const parseResult = paginationSchema.safeParse(ctx.query);
    if (!parseResult.success) {
      return ctx.json({ error: "Invalid pagination parameters" }, 400);
    }

    const { page, pageSize } = parseResult.data;
    const { items, total } = await getSubmissionPage(page, pageSize);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return ctx.json({
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    });
  });

  // Export all submissions in requested format
  router.get(submissionsPath("/export"), async (ctx) => {
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
      const { exportSubmissions } = await import("../services/statisticsService.js");
      const { buffer, filename, contentType } = await exportSubmissions(format);
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
      ctx.logError(err, "Failed to export submissions");
      return ctx.json({ error: "Failed to export submissions" }, 500);
    }
  });
}
