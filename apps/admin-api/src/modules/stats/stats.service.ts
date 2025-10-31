import { prisma } from "../../services/prisma.js";

export interface StatsOverview {
  totalSessions: number;
  uniqueUsers: number;
  completedRecommendations: number;
  updatedAt: Date;
}

export async function fetchStatsOverview(): Promise<StatsOverview> {
  const totals = await prisma.sectionMetric.aggregate({
    _sum: {
      totalSessions: true,
      uniqueUsers: true,
      completedRecommendations: true,
    },
    _max: { updatedAt: true },
  });

  return {
    totalSessions: totals._sum.totalSessions ?? 0,
    uniqueUsers: totals._sum.uniqueUsers ?? 0,
    completedRecommendations: totals._sum.completedRecommendations ?? 0,
    updatedAt: totals._max.updatedAt ?? new Date(0),
  };
}
