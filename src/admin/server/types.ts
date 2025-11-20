import type { AdminConfig } from "../config.js";

export interface BuildAdminServerOptions {
  config: AdminConfig;
  rootDir?: string;
}

export interface AdminServer {
  start(options: { port: number; hostname?: string }): Promise<void>;
  stop(): Promise<void>;
}
