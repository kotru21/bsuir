import path from "node:path";
import type { AdminConfig } from "../config.js";
import type { AdminRouter, RouteContext } from "../http/types.js";
import { buildAdminPath } from "../http/pathUtils.js";

export interface RegisterUiRoutesOptions {
  config: AdminConfig;
  staticRoot: string;
}

async function loadIndex(staticRoot: string): Promise<string | null> {
  const indexPath = path.join(staticRoot, "index.html");
  const file = Bun.file(indexPath);
  if (!(await file.exists())) {
    console.warn(`Admin UI index not found at ${indexPath}`);
    return null;
  }
  return await file.text();
}

function respondWithIndex(
  ctx: RouteContext,
  getIndex: () => Promise<string | null>
): Promise<Response> {
  return (async () => {
    const html = await getIndex();
    if (!html) {
      return ctx.json(
        { error: "Admin UI is not built yet. Run bun run build:admin." },
        503
      );
    }
    return ctx.html(html, 200, {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
  })();
}

export async function registerUiRoutes(
  router: AdminRouter,
  options: RegisterUiRoutesOptions
): Promise<void> {
  const { config, staticRoot } = options;
  let cachedIndex: string | null = null;

  async function getCachedIndex(): Promise<string | null> {
    if (!cachedIndex) {
      cachedIndex = await loadIndex(staticRoot);
    }
    return cachedIndex;
  }

  const basePath = buildAdminPath(config.basePath, "");
  const trailingPath = basePath ? `${basePath}/` : "/";
  const wildcardPath = buildAdminPath(config.basePath, "/*") || "/*";

  router.get(basePath || "/", async (ctx) =>
    respondWithIndex(ctx, getCachedIndex)
  );

  router.get(trailingPath, async (ctx) =>
    respondWithIndex(ctx, getCachedIndex)
  );

  router.get(wildcardPath, async (ctx) => {
    const acceptHeader = ctx.getHeader("accept") ?? "";
    const urlPath = ctx.url.pathname ?? "";
    const isHtmlRequest = acceptHeader.includes("text/html");
    if (isHtmlRequest && urlPath.startsWith(basePath ?? "")) {
      return respondWithIndex(ctx, getCachedIndex);
    }
    return ctx.json(
      {
        status: "not-found",
        path: urlPath,
      },
      404
    );
  });
}
