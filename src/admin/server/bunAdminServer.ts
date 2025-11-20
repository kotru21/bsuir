import { password as bunPassword } from "bun";
import { registerAdminRoutes } from "../routes/index.js";
import type { RouteHandler, HttpMethod } from "../http/types.js";
import { RouteRegistry } from "../http/router.js";
import {
  HttpError,
  stripBody,
  type AdminRequestContext,
} from "../http/context.js";
import { createJwtManager, type JwtManager } from "../http/jwt.js";
import { buildSecurityHeaders } from "../http/security.js";
import { normalizeBasePath } from "../http/pathUtils.js";
import type { StaticAssetService } from "../http/staticAssets.js";
import { createContextFactory, type CreateContext } from "./contextFactory.js";
import { createStaticResources } from "./staticResources.js";
import type { AdminServer } from "./types.js";
import type { ResolvedAdminConfig } from "../config.js";

export class BunAdminServer implements AdminServer {
  private server: ReturnType<typeof Bun.serve> | null = null;
  private router: RouteRegistry | null = null;
  private readonly config: ResolvedAdminConfig;
  private readonly rootDir: string;
  private readonly staticRoot: string;
  private readonly basePath: string;
  private readonly securityHeaders: Record<string, string>;
  private readonly jwtManager: JwtManager;
  private readonly staticService: StaticAssetService;
  private readonly contextFactory: CreateContext;

  constructor(params: { config: ResolvedAdminConfig; rootDir: string }) {
    this.config = params.config;
    this.rootDir = params.rootDir;
    this.basePath = normalizeBasePath(this.config.basePath);
    this.securityHeaders = buildSecurityHeaders(this.config);
    this.jwtManager = createJwtManager(this.config);
    const staticResources = createStaticResources({
      rootDir: this.rootDir,
      basePath: this.basePath,
      securityHeaders: this.securityHeaders,
    });
    this.staticRoot = staticResources.staticRoot;
    this.staticService = staticResources.staticService;
    this.contextFactory = createContextFactory({
      config: this.config,
      securityHeaders: this.securityHeaders,
      jwtManager: this.jwtManager,
      credentialVerifier: this.verifyAdminCredentials.bind(this),
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
      const ctx = this.contextFactory(
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

    const fallbackCtx = this.contextFactory(request, url, normalizedMethod, {});
    return fallbackCtx.json(
      {
        status: "not-found",
        path: url.pathname,
      },
      404
    );
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
