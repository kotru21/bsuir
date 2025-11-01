import { z } from "zod";

export const adminRoleSchema = z.enum(["admin", "analyst", "support"]);

export const adminUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  role: adminRoleSchema,
});

export const loginRequestSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export const sessionSchema = z.object({
  accessToken: z.string(),
  expiresAt: z.string(),
  user: adminUserSchema,
});

export const loginResponseSchema = sessionSchema;
export const refreshResponseSchema = sessionSchema;

export const statsOverviewSchema = z.object({
  totalSessions: z.number().nonnegative(),
  uniqueUsers: z.number().nonnegative(),
  completedRecommendations: z.number().nonnegative(),
  updatedAt: z.string(),
});

export type AdminRole = z.infer<typeof adminRoleSchema>;
export type AdminUser = z.infer<typeof adminUserSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type SessionResponse = z.infer<typeof sessionSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
export type StatsOverview = z.infer<typeof statsOverviewSchema>;
