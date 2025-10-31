import { createLogger } from "@bsuir-admin/logger";
import { loadEnv } from "./config/env.js";

const env = loadEnv();

export const logger = createLogger({
  name: "bsuir-admin-api",
  level: env.NODE_ENV === "production" ? "info" : "debug",
  pretty: env.NODE_ENV !== "production",
});
