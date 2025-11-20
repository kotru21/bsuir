import path from "node:path";
import type { AdminConfig } from "../config.js";
import type { AdminRouter } from "../http/types.js";
import { buildAdminApiPath } from "../http/pathUtils.js";

type UploadedFile = Blob & { name?: string };

export async function registerUploadRoutes(
  router: AdminRouter,
  options: { config: AdminConfig }
): Promise<void> {
  const { config } = options;
  const uploadPath = buildAdminApiPath(config.basePath, "/upload");

  router.post(uploadPath, async (ctx) => {
    await ctx.requireAdminAuth();
    ctx.verifyAdminCsrfToken();
    const form = await ctx.readFormData();
    const formValues = [...form.values()] as Array<UploadedFile | string>;
    const fileEntry = formValues.find(
      (value): value is UploadedFile => typeof value !== "string"
    );

    if (!fileEntry) {
      return ctx.json({ error: "No file uploaded" }, 400);
    }

    if (!fileEntry.name) {
      return ctx.json({ error: "Invalid file metadata" }, 400);
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(fileEntry.type)) {
      return ctx.json({ error: "Invalid file type" }, 400);
    }

    if (fileEntry.size > 5 * 1024 * 1024) {
      return ctx.json({ error: "File too large" }, 400);
    }

    const uploadDir = path.resolve(process.cwd(), "src", "data", "images");
    const basename = path.basename(fileEntry.name);
    const filename = `${Date.now()}-${basename}`;
    const filepath = path.join(uploadDir, filename);

    await Bun.write(filepath, fileEntry, { createPath: true });

    return ctx.json({
      success: true,
      path: filename,
      url: `/data/images/${filename}`,
    });
  });
}
