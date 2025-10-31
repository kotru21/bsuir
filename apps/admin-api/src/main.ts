import { pathToFileURL } from "node:url";
import { createApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { logger } from "./logger.js";

async function bootstrap() {
  const env = loadEnv();
  const app = createApp();

  try {
    await app.listen({ port: env.ADMIN_API_PORT, host: "0.0.0.0" });
    logger.info({ port: env.ADMIN_API_PORT }, "Admin API started");
  } catch (error) {
    logger.error({ err: error }, "Failed to start Admin API");
    process.exit(1);
  }
}

const isDirectExecution = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

if (isDirectExecution) {
  bootstrap();
}

export { bootstrap };
