import type { HttpMethod, RouteHandler, AdminRouter } from "./types.js";

interface RouteDefinition {
  method: HttpMethod;
  handler: RouteHandler;
  matcher: RegExp;
  paramNames: string[];
}

export interface RouteMatch {
  handler: RouteHandler;
  params: Record<string, string>;
}

export class RouteRegistry implements AdminRouter {
  private readonly routes: RouteDefinition[] = [];

  get(path: string, handler: RouteHandler): void {
    this.add("GET", path, handler);
  }

  post(path: string, handler: RouteHandler): void {
    this.add("POST", path, handler);
  }

  put(path: string, handler: RouteHandler): void {
    this.add("PUT", path, handler);
  }

  delete(path: string, handler: RouteHandler): void {
    this.add("DELETE", path, handler);
  }

  match(method: HttpMethod, pathname: string): RouteMatch | null {
    for (const route of this.routes) {
      if (route.method !== method) {
        continue;
      }
      const match = route.matcher.exec(pathname);
      if (!match) {
        continue;
      }
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, index) => {
        params[name] = decodeURIComponent(match[index + 1]);
      });
      return { handler: route.handler, params };
    }
    return null;
  }

  private add(method: HttpMethod, path: string, handler: RouteHandler): void {
    const compiled = compilePattern(path);
    this.routes.push({
      method,
      handler,
      matcher: compiled.regex,
      paramNames: compiled.paramNames,
    });
  }
}

function compilePattern(pathPattern: string): {
  regex: RegExp;
  paramNames: string[];
} {
  const normalized = normalizeRoutePattern(pathPattern);
  if (normalized === "/") {
    return { regex: /^\/$/, paramNames: [] };
  }

  const segments = normalized.slice(1).split("/");
  let regex = "^";
  const paramNames: string[] = [];

  for (const segment of segments) {
    if (segment === "*") {
      regex += "/.*";
      break;
    }
    if (segment.startsWith(":")) {
      const name = segment.slice(1);
      paramNames.push(name);
      regex += "/([^/]+)";
    } else {
      regex += `/${escapeRegex(segment)}`;
    }
  }

  if (!normalized.endsWith("/*")) {
    regex += "/?";
  }

  regex += "$";
  return { regex: new RegExp(regex), paramNames };
}

function normalizeRoutePattern(input: string): string {
  if (!input) {
    return "/";
  }
  let normalized = input.replace(/\/+/g, "/");
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }
  if (
    normalized.length > 1 &&
    normalized.endsWith("/") &&
    !normalized.endsWith("/*")
  ) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
