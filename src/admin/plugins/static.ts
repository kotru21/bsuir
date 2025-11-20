import path from "node:path";
import fastifyStatic from "@fastify/static";
import type { FastifyInstance } from "fastify";

export async function registerStaticFiles(
  instance: FastifyInstance,
  basePath: string,
  cwd = process.cwd()
) {
  const staticRoot = path.resolve(cwd, "dist", "admin");
  const assetsRoot = path.join(staticRoot, "assets");

  await instance.register(fastifyStatic, {
    root: assetsRoot,
    prefix: `${basePath}/assets/`,
    decorateReply: false,
    index: false,
  });

  const imagesRoot = path.resolve(cwd, "data", "images");
  const srcImagesRoot = path.resolve(cwd, "src", "data", "images");

  await instance.register(fastifyStatic, {
    root: [imagesRoot, srcImagesRoot],
    prefix: "/data/images/",
    decorateReply: false,
    index: false,
    list: false,
    wildcard: true,
  });

  return { staticRoot, assetsRoot };
}
