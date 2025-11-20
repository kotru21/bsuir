import { randomBytes, timingSafeEqual } from "node:crypto";
import type { ResolvedAdminConfig } from "../config.js";
import type {
  AdminSessionState,
  CookieOptions,
  HttpMethod,
  RouteContext,
} from "./types.js";
import type { JwtManager } from "./jwt.js";
import { applySecurityHeaders } from "./security.js";

const CSRF_HEADER = "x-csrf-token";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export class AdminRequestContext implements RouteContext {
  readonly request: Request;
  readonly method: HttpMethod;
  readonly url: URL;
  readonly params: Record<string, string>;
  readonly query: Record<string, string | undefined>;
  readonly headers: Headers;
  readonly config: ResolvedAdminConfig;
  private readonly securityHeaders: Record<string, string>;
  private readonly credentialVerifier: (
    username: string,
    password: string
  ) => Promise<boolean>;
  private readonly jwtManager: JwtManager;
  private readonly responseCookies: string[] = [];
  private readonly cookies: Record<string, string>;
  private responseCommitted = false;
  private cachedBodyText: string | null = null;
  private cachedFormData: FormData | null = null;
  private bodyMode: "none" | "text" | "form" = "none";
  private sessionResolved = false;
  private sessionValue: AdminSessionState | null = null;

  constructor(params: {
    request: Request;
    url: URL;
    method: HttpMethod;
    params: Record<string, string>;
    config: ResolvedAdminConfig;
    securityHeaders: Record<string, string>;
    credentialVerifier: (
      username: string,
      password: string
    ) => Promise<boolean>;
    jwtManager: JwtManager;
  }) {
    this.request = params.request;
    this.url = params.url;
    this.method = params.method;
    this.params = params.params;
    this.config = params.config;
    this.securityHeaders = params.securityHeaders;
    this.credentialVerifier = params.credentialVerifier;
    this.jwtManager = params.jwtManager;
    this.headers = this.request.headers;
    this.cookies = parseCookies(this.request.headers.get("cookie"));
    this.query = buildQueryObject(this.url.searchParams);
  }

  getCookie(name: string): string | undefined {
    return this.cookies[name];
  }

  setCookie(name: string, value: string, options?: CookieOptions): void {
    this.responseCookies.push(serializeCookie(name, value, options));
  }

  clearCookie(name: string, options?: CookieOptions): void {
    this.setCookie(name, "", {
      ...options,
      maxAge: 0,
      expires: new Date(0),
    });
  }

  async readJson<T = unknown>(): Promise<T> {
    const text = await this.readText();
    if (!text) {
      throw new HttpError(400, "Invalid JSON payload");
    }
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new HttpError(400, "Invalid JSON payload", { cause: error });
    }
  }

  async readText(): Promise<string> {
    if (this.bodyMode === "form") {
      throw new HttpError(400, "Body already consumed as form data");
    }
    if (this.bodyMode === "text" && this.cachedBodyText !== null) {
      return this.cachedBodyText;
    }
    this.cachedBodyText = await this.request.text();
    this.bodyMode = "text";
    return this.cachedBodyText;
  }

  async readFormData(): Promise<FormData> {
    if (this.bodyMode === "text") {
      throw new HttpError(400, "Body already consumed as text");
    }
    if (this.cachedFormData) {
      return this.cachedFormData;
    }
    this.cachedFormData = await this.request.formData();
    this.bodyMode = "form";
    return this.cachedFormData;
  }

  json<T>(data: T, status = 200, headers?: Record<string, string>): Response {
    return this.finalizeResponse(JSON.stringify(data), status, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    });
  }

  text(body: string, status = 200, headers?: Record<string, string>): Response {
    return this.finalizeResponse(body, status, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    });
  }

  html(body: string, status = 200, headers?: Record<string, string>): Response {
    return this.finalizeResponse(body, status, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      ...headers,
    });
  }

  redirect(location: string, status = 302): Response {
    return this.finalizeResponse(null, status, {
      Location: location,
      "Cache-Control": "no-store",
    });
  }

  issueAdminCsrfToken(): string {
    return randomBytes(32).toString("hex");
  }

  verifyAdminCsrfToken(presentedToken?: string): void {
    const cookieToken = this.getCookie(this.config.csrfCookieName);
    const headerToken = this.getHeader(CSRF_HEADER) ?? undefined;
    const candidate = presentedToken ?? headerToken;
    if (!cookieToken || !candidate) {
      throw new HttpError(403, "Missing CSRF token");
    }
    if (cookieToken.length !== candidate.length) {
      throw new HttpError(403, "Invalid CSRF token");
    }
    const cookieBuffer = Buffer.from(cookieToken);
    const candidateBuffer = Buffer.from(candidate);
    if (!timingSafeEqual(cookieBuffer, candidateBuffer)) {
      throw new HttpError(403, "Invalid CSRF token");
    }
    const session = this.resolveSession();
    if (session?.xsrfToken && session.xsrfToken !== candidate) {
      throw new HttpError(403, "Invalid CSRF token");
    }
  }

  async getAdminSession(): Promise<AdminSessionState | null> {
    return this.resolveSession();
  }

  async requireAdminAuth(): Promise<AdminSessionState> {
    const session = this.resolveSession();
    if (!session) {
      throw new HttpError(401, "Authentication required");
    }
    return session;
  }

  async setAdminSession(username: string, xsrfToken: string): Promise<void> {
    const token = this.jwtManager.sign({ username, xsrfToken });
    this.setCookie(this.config.jwtCookieName, token, {
      httpOnly: true,
      secure: this.config.cookieSecure,
      sameSite: "lax",
      path: this.config.basePath || "/",
      maxAge: this.config.jwtTtlSeconds,
    });
    this.sessionResolved = true;
    this.sessionValue = { username, xsrfToken };
  }

  clearAdminSession(): void {
    this.clearCookie(this.config.jwtCookieName, {
      path: this.config.basePath || "/",
    });
    this.sessionResolved = true;
    this.sessionValue = null;
  }

  async verifyAdminCredentials(
    username: string,
    password: string
  ): Promise<boolean> {
    return this.credentialVerifier(username, password);
  }

  logError(error: unknown, message?: string): void {
    if (message) {
      console.error(message, error);
    } else {
      console.error(error);
    }
  }

  getHeader(name: string): string | null {
    return this.request.headers.get(name);
  }

  private resolveSession(): AdminSessionState | null {
    if (this.sessionResolved) {
      return this.sessionValue;
    }
    this.sessionResolved = true;
    const token = this.getCookie(this.config.jwtCookieName);
    if (!token) {
      this.sessionValue = null;
      return null;
    }
    this.sessionValue = this.jwtManager.verify(token);
    return this.sessionValue;
  }

  private finalizeResponse(
    body: BodyInit | null,
    status: number,
    headers: Record<string, string>
  ): Response {
    if (this.responseCommitted) {
      throw new Error("Response already sent");
    }
    const merged = new Headers(headers);
    applySecurityHeaders(merged, this.securityHeaders);
    for (const cookie of this.responseCookies) {
      merged.append("Set-Cookie", cookie);
    }
    this.responseCommitted = true;
    return new Response(body, { status, headers: merged });
  }
}

export function stripBody(response: Response): Response {
  if (response.body) {
    try {
      response.body.cancel();
    } catch {
      // ignore
    }
  }
  const headers = new Headers(response.headers);
  return new Response(null, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function parseCookies(header: string | null): Record<string, string> {
  if (!header) {
    return {};
  }
  const cookies: Record<string, string> = {};
  for (const part of header.split(/; */)) {
    if (!part) {
      continue;
    }
    const separatorIndex = part.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }
    const name = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    if (name) {
      cookies[name] = decodeURIComponent(value);
    }
  }
  return cookies;
}

function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  let cookie = `${name}=${encodeURIComponent(value)}`;
  if (options.maxAge !== undefined) {
    cookie += `; Max-Age=${Math.floor(options.maxAge)}`;
  }
  if (options.expires) {
    cookie += `; Expires=${options.expires.toUTCString()}`;
  }
  if (options.domain) {
    cookie += `; Domain=${options.domain}`;
  }
  if (options.path) {
    cookie += `; Path=${options.path}`;
  }
  if (options.secure) {
    cookie += "; Secure";
  }
  if (options.httpOnly) {
    cookie += "; HttpOnly";
  }
  if (options.sameSite) {
    const normalized = options.sameSite.toLowerCase();
    const formatted =
      normalized === "strict"
        ? "Strict"
        : normalized === "none"
        ? "None"
        : "Lax";
    cookie += `; SameSite=${formatted}`;
  }
  return cookie;
}

function buildQueryObject(
  searchParams: URLSearchParams
): Record<string, string | undefined> {
  const query: Record<string, string | undefined> = {};
  for (const [key, value] of searchParams.entries()) {
    if (!(key in query)) {
      query[key] = value;
    }
  }
  return query;
}
