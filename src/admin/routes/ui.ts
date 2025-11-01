import { promises as fs } from "node:fs";
import path from "node:path";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { AdminConfig } from "../config.js";

export interface RegisterUiRoutesOptions {
  config: AdminConfig;
  staticRoot: string;
}

async function loadIndex(staticRoot: string): Promise<string | null> {
  const indexPath = path.join(staticRoot, "index.html");
  try {
    return await fs.readFile(indexPath, "utf8");
  } catch (_err) {
    console.warn(`Admin UI index not found at ${indexPath}`);
    return null;
  }
}

export async function registerUiRoutes(
  app: FastifyInstance,
  options: RegisterUiRoutesOptions
): Promise<void> {
  const { config, staticRoot } = options;
  let cachedIndex: string | null = null;

  const normalizedBase = config.basePath.endsWith("/")
    ? config.basePath.slice(0, -1)
    : config.basePath;
  const apiPrefix = `${normalizedBase}/api`;
  const assetsPrefix = `${normalizedBase}/assets`;

  async function serveIndex(reply: FastifyReply): Promise<void> {
    if (!cachedIndex) {
      cachedIndex = await loadIndex(staticRoot);
    }
    if (!cachedIndex) {
      reply.code(503).type("application/json").send({
        error: "Admin UI is not built yet. Run npm run build:admin.",
      });
      return;
    }

    reply.type("text/html").send(cachedIndex);
  }

  app.get(
    `${config.basePath}`,
    async (request: FastifyRequest, reply: FastifyReply) => {
      await serveIndex(reply);
    }
  );

  app.get(
    `${config.basePath}/*`,
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (
        request.url.startsWith(apiPrefix) ||
        request.url.startsWith(assetsPrefix)
      ) {
        reply.callNotFound();
        return;
      }
      await serveIndex(reply);
    }
  );
}
