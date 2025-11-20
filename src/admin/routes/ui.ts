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

  async function serveIndex(reply: FastifyReply): Promise<void> {
    if (!cachedIndex) {
      cachedIndex = await loadIndex(staticRoot);
    }
    if (!cachedIndex) {
      reply.code(503).type("application/json").send({
        error: "Admin UI is not built yet. Run bun run build:admin.",
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

  app.setNotFoundHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      const acceptHeader = request.headers["accept"] ?? "";
      const url = request.url ?? "";
      const isHtmlRequest =
        typeof acceptHeader === "string" && acceptHeader.includes("text/html");
      if (isHtmlRequest && url.startsWith(config.basePath)) {
        await serveIndex(reply);
        return;
      }

      reply.code(404).type("application/json").send({
        status: "not-found",
        path: url,
      });
    }
  );
}
