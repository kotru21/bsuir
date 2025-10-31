import { z } from "zod";

export const loginRequestSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  expiresAt: z.string(),
});

export const statsOverviewSchema = z.object({
  totalSessions: z.number().nonnegative(),
  uniqueUsers: z.number().nonnegative(),
  completedRecommendations: z.number().nonnegative(),
  updatedAt: z.string(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type StatsOverview = z.infer<typeof statsOverviewSchema>;
