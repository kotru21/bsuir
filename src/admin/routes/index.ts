import type { FastifyInstance } from "fastify";
import type { AdminConfig } from "../config.js";
import { registerAuthRoutes } from "./auth.js";
import { registerStatsRoutes } from "./stats.js";
import { registerSubmissionRoutes } from "./submissions.js";
import { registerUiRoutes } from "./ui.js";

export interface AdminRouteOptions {
  config: AdminConfig;
  staticRoot: string;
}

export async function registerAdminRoutes(
  app: FastifyInstance,
  options: AdminRouteOptions
): Promise<void> {
  const { config, staticRoot } = options;

  await registerAuthRoutes(app, { config });
  await registerStatsRoutes(app, { config });
  await registerSubmissionRoutes(app, { config });
  await registerUiRoutes(app, { config, staticRoot });

  app.get("/", async () => ({ status: "ok" }));
}
