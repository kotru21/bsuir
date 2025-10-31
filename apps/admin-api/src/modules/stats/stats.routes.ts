import type { FastifyPluginAsync } from "fastify";
import { statsOverviewSchema } from "@bsuir-admin/types";
import { fetchStatsOverview } from "./stats.service.js";

export const statsRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/stats/overview",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              totalSessions: { type: "integer" },
              uniqueUsers: { type: "integer" },
              completedRecommendations: { type: "integer" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    async () => {
      const overview = await fetchStatsOverview();

      return statsOverviewSchema.parse({
        totalSessions: overview.totalSessions,
        uniqueUsers: overview.uniqueUsers,
        completedRecommendations: overview.completedRecommendations,
        updatedAt: overview.updatedAt.toISOString(),
      });
    }
  );
};

export default statsRoutes;
