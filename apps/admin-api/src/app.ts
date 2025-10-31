import fastify from "fastify";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { loadEnv } from "./config/env.js";
import { logger } from "./logger.js";
import authPlugin from "./modules/auth/auth.plugin.js";
import healthRoutes from "./routes/health.js";
import statsRoutes from "./modules/stats/stats.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { ensureBootstrapAdmin } from "./services/bootstrapAdmin.js";
import { prisma } from "./services/prisma.js";

export function createApp() {
  const env = loadEnv();

  const app = fastify({
    logger,
    disableRequestLogging: env.NODE_ENV === "production",
  });

  app.register(helmet, { contentSecurityPolicy: false });
  app.register(cookie);
  app.register(rateLimit, {
    max: env.ADMIN_RATE_LIMIT_MAX ?? 60,
    timeWindow: env.ADMIN_RATE_LIMIT_WINDOW_MS ?? 60_000,
  });

  app.register(authPlugin, {
    publicRoutes: ["/health/live", "/health/ready", "/auth/login"],
  });

  app.register(authRoutes);
  app.register(healthRoutes);
  app.register(statsRoutes, { prefix: "/api" });

  app.addHook("onReady", async () => {
    await ensureBootstrapAdmin();
  });

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
}
