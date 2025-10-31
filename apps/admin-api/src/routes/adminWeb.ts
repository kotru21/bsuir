import fastifyStatic from "@fastify/static";
import type { FastifyPluginAsync } from "fastify";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const adminWebDistPath = join(
  currentDir,
  "..",
  "..",
  "..",
  "admin-web",
  "dist"
);

const staticPaths = [/^\/api(\/|$)/, /^\/auth(\/|$)/, /^\/health(\/|$)/];

export const adminWebRoutes: FastifyPluginAsync = async (app) => {
  await app.register(fastifyStatic, {
    root: adminWebDistPath,
    prefix: "/",
    index: ["index.html"],
    maxAge: "1h",
    list: false,
    wildcard: false,
  });

  app.get("/*", async (request, reply) => {
    const urlPath = request.url ?? "/";
    if (staticPaths.some((pattern) => pattern.test(urlPath))) {
      reply.code(404).send({ message: "Not found" });
      return;
    }

    return reply.type("text/html").sendFile("index.html");
  });
};

export default adminWebRoutes;
