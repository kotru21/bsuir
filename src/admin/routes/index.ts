import type { AdminConfig } from "../config.js";
import type { AdminRouter } from "../http/types.js";
import { buildAdminPath } from "../http/pathUtils.js";
import { registerAuthRoutes } from "./auth.js";
import { registerStatsRoutes } from "./stats.js";
import { registerSubmissionRoutes } from "./submissions.js";
import { registerUiRoutes } from "./ui.js";
import { registerSectionsRoutes } from "./sections.js";
import { registerUploadRoutes } from "./upload.js";

export interface AdminRouteOptions {
  config: AdminConfig;
  staticRoot: string;
}

export async function registerAdminRoutes(
  router: AdminRouter,
  options: AdminRouteOptions
): Promise<void> {
  const { config, staticRoot } = options;

  await registerAuthRoutes(router, { config });
  await registerStatsRoutes(router, { config });
  await registerSectionsRoutes(router, { config });
  await registerUploadRoutes(router, { config });
  await registerSubmissionRoutes(router, { config });
  await registerUiRoutes(router, { config, staticRoot });

  router.get("/", async (ctx) => {
    const target = buildAdminPath(config.basePath, "/");
    return ctx.redirect(target || "/");
  });
}
