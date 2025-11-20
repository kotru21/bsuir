import { resolveAdminConfig } from "./config.js";
import { BunAdminServer } from "./server/bunAdminServer.js";
import type { BuildAdminServerOptions, AdminServer } from "./server/types.js";

export type { BuildAdminServerOptions, AdminServer } from "./server/types.js";

export async function buildAdminServer(
  options: BuildAdminServerOptions
): Promise<AdminServer> {
  const resolvedConfig = await resolveAdminConfig(options.config);
  const rootDir = options.rootDir ?? process.cwd();
  return new BunAdminServer({ config: resolvedConfig, rootDir });
}
