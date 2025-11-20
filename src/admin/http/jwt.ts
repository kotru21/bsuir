import { createHmac, timingSafeEqual } from "node:crypto";
import type { ResolvedAdminConfig } from "../config.js";
import type { AdminSessionState } from "./types.js";

export interface JwtManager {
  sign(payload: { username: string; xsrfToken: string }): string;
  verify(token: string): AdminSessionState | null;
}

export function createJwtManager(config: ResolvedAdminConfig): JwtManager {
  return {
    sign({ username, xsrfToken }) {
      const now = Math.floor(Date.now() / 1000);
      const header = base64UrlEncode(
        JSON.stringify({ alg: "HS256", typ: "JWT" })
      );
      const payload = base64UrlEncode(
        JSON.stringify({
          username,
          xsrfToken,
          iss: config.jwtIssuer,
          aud: config.jwtAudience,
          exp: now + config.jwtTtlSeconds,
        })
      );
      const data = `${header}.${payload}`;
      const signature = createHmac("sha256", config.jwtSecret)
        .update(data)
        .digest("base64url");
      return `${data}.${signature}`;
    },
    verify(token: string) {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return null;
      }
      const [headerPart, payloadPart, signaturePart] = parts;
      const data = `${headerPart}.${payloadPart}`;
      const expectedSignature = createHmac("sha256", config.jwtSecret)
        .update(data)
        .digest();
      let actualSignature: Buffer;
      try {
        actualSignature = base64UrlDecode(signaturePart);
      } catch {
        return null;
      }
      if (
        expectedSignature.length !== actualSignature.length ||
        !timingSafeEqual(expectedSignature, actualSignature)
      ) {
        return null;
      }
      try {
        const payloadJson = base64UrlDecode(payloadPart).toString("utf8");
        const payload = JSON.parse(payloadJson) as {
          username?: string;
          xsrfToken?: string;
          iss?: string;
          aud?: string;
          exp?: number;
        };
        if (
          payload.iss !== config.jwtIssuer ||
          payload.aud !== config.jwtAudience ||
          typeof payload.username !== "string" ||
          typeof payload.xsrfToken !== "string"
        ) {
          return null;
        }
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
          return null;
        }
        return {
          username: payload.username,
          xsrfToken: payload.xsrfToken,
        };
      } catch {
        return null;
      }
    },
  };
}

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string): Buffer {
  let normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4;
  if (pad === 2) {
    normalized += "==";
  } else if (pad === 3) {
    normalized += "=";
  } else if (pad === 1) {
    normalized += "=";
  }
  return Buffer.from(normalized, "base64");
}
