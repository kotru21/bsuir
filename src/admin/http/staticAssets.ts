import path from "node:path";
import { applySecurityHeaders } from "./security.js";
import {
  buildPrefixedPath,
  ensureTrailingSlash,
  normalizeRelativePath,
} from "./pathUtils.js";

interface StaticAssetServiceOptions {
  basePath: string;
  staticRoot: string;
  imageRoots: string[];
  securityHeaders: Record<string, string>;
}

export interface StaticAssetService {
  tryHandle(request: Request, url: URL): Promise<Response | null>;
}

export function createStaticAssetService(
  options: StaticAssetServiceOptions
): StaticAssetService {
  return new BunStaticAssetService(options);
}

class BunStaticAssetService implements StaticAssetService {
  private readonly assetPrefix: string;
  private readonly imageRoots: string[];
  private readonly securityHeaders: Record<string, string>;
  private readonly assetsRoot: string;

  constructor(options: StaticAssetServiceOptions) {
    this.imageRoots = options.imageRoots;
    this.securityHeaders = options.securityHeaders;
    this.assetPrefix = ensureTrailingSlash(
      buildPrefixedPath(options.basePath, "/assets")
    );
    this.assetsRoot = path.join(options.staticRoot, "assets");
  }

  async tryHandle(request: Request, url: URL): Promise<Response | null> {
    const method = request.method.toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
      return null;
    }

    if (url.pathname.startsWith(this.assetPrefix)) {
      const relativePath = normalizeRelativePath(
        url.pathname.slice(this.assetPrefix.length)
      );
      if (!relativePath) {
        return new Response("Not Found", { status: 404 });
      }
      const candidate = path.join(this.assetsRoot, relativePath);
      const served = await this.serveFile(request, candidate, {
        cacheControl: "public, max-age=31536000, immutable",
      });
      if (served) {
        return served;
      }
      return new Response("Not Found", { status: 404 });
    }

    if (url.pathname.startsWith("/data/images/")) {
      const relative = normalizeRelativePath(
        url.pathname.slice("/data/images/".length)
      );
      if (!relative) {
        return new Response("Not Found", { status: 404 });
      }
      for (const root of this.imageRoots) {
        const candidate = path.join(root, relative);
        const served = await this.serveFile(request, candidate, {
          cacheControl: "public, max-age=3600",
        });
        if (served) {
          return served;
        }
      }
      return new Response("Not Found", { status: 404 });
    }

    return null;
  }

  private async serveFile(
    request: Request,
    filePath: string,
    options: { cacheControl: string }
  ): Promise<Response | null> {
    const file = Bun.file(filePath);
    if (!(await file.exists())) {
      return null;
    }

    const headers = new Headers({
      "Content-Type": file.type || "application/octet-stream",
      "Cache-Control": options.cacheControl,
    });
    applySecurityHeaders(headers, this.securityHeaders);

    if (request.method.toUpperCase() === "HEAD") {
      return new Response(null, { status: 200, headers });
    }

    return new Response(file, { status: 200, headers });
  }
}
