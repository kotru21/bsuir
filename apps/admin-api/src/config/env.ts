import { loadConfig } from "@bsuir-admin/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  ADMIN_API_PORT: z.coerce.number().int().positive().default(4000),
  ADMIN_PASETO_LOCAL_KEY: z
    .string()
    .min(32, "ADMIN_PASETO_LOCAL_KEY must be at least 32 characters"),
  ADMIN_PASETO_PUBLIC_KEY: z.string().min(32).optional(),
  ADMIN_DATABASE_URL: z
    .string()
    .min(5)
    .default("file:./apps/admin-api/data/admin.sqlite"),
  ADMIN_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().optional(),
  ADMIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().optional(),
  ADMIN_BOOTSTRAP_USERNAME: z.string().min(3).optional(),
  ADMIN_BOOTSTRAP_PASSWORD: z.string().min(8).optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(dotenvPath?: string): AppEnv {
  if (!process.env.ADMIN_API_PORT && process.env.PORT) {
    process.env.ADMIN_API_PORT = process.env.PORT;
  }

  return loadConfig(envSchema, { dotenvPath });
}
