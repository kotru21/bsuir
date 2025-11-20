import { z } from "zod";
import type { AdminConfig } from "../config.js";
import type { AdminRouter, RouteContext } from "../http/types.js";
import { buildAdminApiPath } from "../http/pathUtils.js";

export interface RegisterAuthRoutesOptions {
  config: AdminConfig;
}

const loginSchema = z.object({
  username: z.string().min(1).max(128),
  password: z.string().min(1).max(256),
  csrfToken: z.string().min(10),
});

function setCsrfCookie(
  ctx: RouteContext,
  config: AdminConfig,
  token: string
): void {
  ctx.setCookie(config.csrfCookieName, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: config.cookieSecure,
    path: config.basePath || "/",
    maxAge: config.jwtTtlSeconds,
  });
}

function clearCsrfCookie(ctx: RouteContext, config: AdminConfig): void {
  ctx.clearCookie(config.csrfCookieName, {
    path: config.basePath || "/",
  });
}

export async function registerAuthRoutes(
  router: AdminRouter,
  options: RegisterAuthRoutesOptions
): Promise<void> {
  const { config } = options;
  const apiPath = (suffix: string) =>
    buildAdminApiPath(config.basePath, suffix);

  router.get(apiPath("/health"), async (ctx) => ctx.json({ status: "ok" }));

  router.get(apiPath("/csrf"), async (ctx) => {
    const session = await ctx.getAdminSession();
    const token = session?.xsrfToken ?? ctx.issueAdminCsrfToken();
    setCsrfCookie(ctx, config, token);
    return ctx.json({ token });
  });

  router.get(apiPath("/session"), async (ctx) => {
    const session = await ctx.getAdminSession();
    return ctx.json({
      authenticated: Boolean(session),
      username: session?.username ?? null,
    });
  });

  router.post(apiPath("/login"), async (ctx) => {
    const body = await ctx.readJson<unknown>();
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return ctx.json({ success: false, error: "Invalid payload" }, 400);
    }

    const { username, password, csrfToken } = parseResult.data;
    const cookieToken = ctx.getCookie(config.csrfCookieName);
    if (!cookieToken || cookieToken !== csrfToken) {
      return ctx.json({ success: false, error: "Invalid CSRF token" }, 403);
    }

    const valid = await ctx.verifyAdminCredentials(username, password);
    if (!valid) {
      return ctx.json({ success: false, error: "Invalid credentials" }, 401);
    }

    const freshToken = ctx.issueAdminCsrfToken();
    await ctx.setAdminSession(username, freshToken);
    setCsrfCookie(ctx, config, freshToken);

    return ctx.json({ success: true });
  });

  router.post(apiPath("/logout"), async (ctx) => {
    await ctx.requireAdminAuth();
    ctx.verifyAdminCsrfToken();
    ctx.clearAdminSession();
    clearCsrfCookie(ctx, config);
    return ctx.json({ success: true });
  });
}
