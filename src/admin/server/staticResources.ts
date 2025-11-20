import path from "node:path";
import {
  createStaticAssetService,
  type StaticAssetService,
} from "../http/staticAssets.js";

export interface StaticResources {
  staticRoot: string;
  imageRoots: string[];
  staticService: StaticAssetService;
}

export interface StaticResourcesOptions {
  rootDir: string;
  basePath: string;
  securityHeaders: Record<string, string>;
}

export function createStaticResources(
  options: StaticResourcesOptions
): StaticResources {
  const staticRoot = path.resolve(options.rootDir, "dist", "admin");
  const imageRoots = [
    path.resolve(options.rootDir, "data", "images"),
    path.resolve(options.rootDir, "src", "data", "images"),
  ];

  const staticService = createStaticAssetService({
    basePath: options.basePath,
    staticRoot,
    imageRoots,
    securityHeaders: options.securityHeaders,
  });

  return {
    staticRoot,
    imageRoots,
    staticService,
  };
}
