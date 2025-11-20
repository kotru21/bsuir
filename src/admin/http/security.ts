import type { ResolvedAdminConfig } from "../config.js";

export function applySecurityHeaders(
  headers: Headers,
  securityHeaders: Record<string, string>
): void {
  for (const [key, value] of Object.entries(securityHeaders)) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }
}

export function buildSecurityHeaders(
  config: ResolvedAdminConfig
): Record<string, string> {
  const isProd = (Bun.env.NODE_ENV ?? "development") === "production";
  const scriptSrc = isProd ? "'self'" : "'self' 'unsafe-inline'";
  const directives = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data:`,
    `connect-src 'self'`,
    `font-src 'self' data:`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ];

  const headers: Record<string, string> = {
    "Content-Security-Policy": directives.join("; "),
    "Cross-Origin-Resource-Policy": "cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
  };

  if (config.cookieSecure) {
    headers["Strict-Transport-Security"] =
      "max-age=15552000; includeSubDomains";
  }

  return headers;
}
