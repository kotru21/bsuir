import type { ResolvedAdminConfig } from "../config.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface CookieOptions {
  path?: string;
  domain?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  maxAge?: number;
  expires?: Date;
}

export interface AdminSessionState {
  username: string;
  xsrfToken: string;
}

export interface RouteContext {
  readonly request: Request;
  readonly method: HttpMethod;
  readonly url: URL;
  readonly params: Record<string, string>;
  readonly query: Record<string, string | undefined>;
  readonly headers: Headers;
  readonly config: ResolvedAdminConfig;
  getCookie(name: string): string | undefined;
  setCookie(name: string, value: string, options?: CookieOptions): void;
  clearCookie(name: string, options?: CookieOptions): void;
  readJson<T = unknown>(): Promise<T>;
  readText(): Promise<string>;
  readFormData(): Promise<FormData>;
  json<T>(data: T, status?: number, headers?: Record<string, string>): Response;
  text(
    body: string,
    status?: number,
    headers?: Record<string, string>
  ): Response;
  html(
    body: string,
    status?: number,
    headers?: Record<string, string>
  ): Response;
  redirect(location: string, status?: number): Response;
  issueAdminCsrfToken(): string;
  verifyAdminCsrfToken(presentedToken?: string): void;
  getAdminSession(): Promise<AdminSessionState | null>;
  requireAdminAuth(): Promise<AdminSessionState>;
  setAdminSession(username: string, xsrfToken: string): Promise<void>;
  clearAdminSession(): void;
  verifyAdminCredentials(username: string, password: string): Promise<boolean>;
  logError(error: unknown, message?: string): void;
  getHeader(name: string): string | null;
}

export type RouteHandler = (ctx: RouteContext) => Promise<Response> | Response;

export interface AdminRouter {
  get(path: string, handler: RouteHandler): void;
  post(path: string, handler: RouteHandler): void;
  put(path: string, handler: RouteHandler): void;
  delete(path: string, handler: RouteHandler): void;
}
