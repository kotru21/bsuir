import path from "node:path";
import { password as bunPassword } from "bun";
import { registerAdminRoutes } from "../routes/index.js";
import type { RouteHandler, HttpMethod } from "../http/types.js";
import { RouteRegistry } from "../http/router.js";
import { AdminRequestContext, HttpError, stripBody } from "../http/context.js";
import {
  createStaticAssetService,
  type StaticAssetService,
} from "../http/staticAssets.js";
import { createJwtManager, type JwtManager } from "../http/jwt.js";
import { buildSecurityHeaders } from "../http/security.js";
import { normalizeBasePath } from "../http/pathUtils.js";
import type { AdminServer } from "./types.js";
import type { ResolvedAdminConfig } from "../config.js";

export class BunAdminServer implements AdminServer {
  private server: ReturnType<typeof Bun.serve> | null = null;
  private router: RouteRegistry | null = null;
  private readonly config: ResolvedAdminConfig;
  private readonly rootDir: string;
  private readonly staticRoot: string;
  private readonly imageRoots: string[];
  private readonly basePath: string;
  private readonly securityHeaders: Record<string, string>;
  private readonly jwtManager: JwtManager;
  private readonly staticService: StaticAssetService;

  constructor(params: { config: ResolvedAdminConfig; rootDir: string }) {
    this.config = params.config;
    this.rootDir = params.rootDir;
    this.staticRoot = path.resolve(this.rootDir, "dist", "admin");
    this.imageRoots = [
      path.resolve(this.rootDir, "data", "images"),
      path.resolve(this.rootDir, "src", "data", "images"),
    ];
    this.basePath = normalizeBasePath(this.config.basePath);
    this.securityHeaders = buildSecurityHeaders(this.config);
    this.jwtManager = createJwtManager(this.config);
    this.staticService = createStaticAssetService({
      basePath: this.basePath,
      staticRoot: this.staticRoot,
      imageRoots: this.imageRoots,
      securityHeaders: this.securityHeaders,
    });
  }

  async start(options: { port: number; hostname?: string }): Promise<void> {
    if (this.server) {
      throw new Error("Admin server already started");
    }

    const registry = new RouteRegistry();
    if (this.config.enabled) {
      await registerAdminRoutes(registry, {
        config: this.config,
        staticRoot: this.staticRoot,
      });
    } else {
      this.registerDisabledRoutes(registry);
    }
    this.router = registry;

    this.server = Bun.serve({
      port: options.port,
      hostname: options.hostname ?? "0.0.0.0",
      fetch: (request) => this.handleRequest(request),
      error: (error) => {
        console.error("Admin server unhandled error", error);
        return new Response("Internal Server Error", { status: 500 });
      },
    });
  }

  async stop(): Promise<void> {
    if (this.server) {
      this.server.stop();
      this.server = null;
    }
  }

  private registerDisabledRoutes(router: RouteRegistry): void {
    const disabledResponse = {
      status: "admin-disabled",
      reason: "Admin panel is not configured.",
    } as const;

    const handler: RouteHandler = (ctx) => ctx.json(disabledResponse, 503);
    router.get("/", handler);

    if (this.basePath && this.basePath !== "/") {
      router.get(this.basePath, handler);
      router.get(`${this.basePath}/`, handler);
      router.get(`${this.basePath}/*`, handler);
    } else {
      router.get("/*", handler);
    }
  }

  private async handleRequest(request: Request): Promise<Response> {
    if (!this.router) {
      return new Response("Admin server is not ready", { status: 503 });
    }

    const url = new URL(request.url);

    if (this.config.enabled) {
      const staticResponse = await this.staticService.tryHandle(request, url);
      if (staticResponse) {
        return staticResponse;
      }
    }

    const normalizedMethod = normalizeMethod(request.method);
    if (!normalizedMethod) {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const match = this.router.match(normalizedMethod, url.pathname);

    if (match) {
      const ctx = this.createContext(
        request,
        url,
        normalizedMethod,
        match.params
      );
      try {
        const response = await match.handler(ctx);
        return request.method.toUpperCase() === "HEAD"
          ? stripBody(response)
          : response;
      } catch (error) {
        return this.handleRouteError(error, ctx);
      }
    }

    const fallbackCtx = this.createContext(request, url, normalizedMethod, {});
    return fallbackCtx.json(
      {
        status: "not-found",
        path: url.pathname,
      },
      404
    );
  }

  private createContext(
    request: Request,
    url: URL,
    method: HttpMethod,
    params: Record<string, string>
  ): AdminRequestContext {
    return new AdminRequestContext({
      request,
      url,
      method,
      params,
      config: this.config,
      securityHeaders: this.securityHeaders,
      credentialVerifier: this.verifyAdminCredentials.bind(this),
      jwtManager: this.jwtManager,
    });
  }

  private handleRouteError(error: unknown, ctx: AdminRequestContext): Response {
    if (error instanceof HttpError) {
      const payload =
        typeof error.details === "object" && error.details !== null
          ? error.details
          : { error: error.message };
      return ctx.json(payload as Record<string, unknown>, error.status);
    }

    ctx.logError(error, "Admin route failed");
    return ctx.json({ error: "Internal Server Error" }, 500);
  }

  private async verifyAdminCredentials(
    username: string,
    password: string
  ): Promise<boolean> {
    if (username !== this.config.adminUsername) {
      return false;
    }

    if (!this.config.adminPasswordHash) {
      console.error("Admin password is not configured.");
      return false;
    }

    try {
      return await bunPassword.verify(password, this.config.adminPasswordHash);
    } catch (error) {
      console.error("Failed to verify admin credentials", error);
      return false;
    }
  }
}

function normalizeMethod(method: string): HttpMethod | null {
  switch (method.toUpperCase()) {
    case "GET":
    case "HEAD":
      return "GET";
    case "POST":
      return "POST";
    case "PUT":
      return "PUT";
    case "DELETE":
      return "DELETE";
    default:
      return null;
  }
}
