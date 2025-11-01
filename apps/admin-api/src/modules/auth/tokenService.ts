import { V3 } from "paseto";
import { z } from "zod";
import { loadEnv } from "../../config/env.js";

const env = loadEnv();

const ACCESS_TOKEN_TTL_SECONDS = env.ADMIN_ACCESS_TOKEN_TTL_SECONDS;

const ROLES = ["admin", "analyst", "support"] as const;
export type Role = (typeof ROLES)[number];

const tokenClaimsSchema = z.object({
  sub: z.string(),
  role: z.enum(ROLES),
  sid: z.string().min(1),
  exp: z.coerce.date(),
  iat: z.coerce.date(),
  jti: z.string().uuid(),
});

export type TokenClaims = z.infer<typeof tokenClaimsSchema>;

let cachedKey: Buffer | null = null;

function getLocalKey(): Buffer {
  if (cachedKey) {
    return cachedKey;
  }

  const { ADMIN_PASETO_LOCAL_KEY } = loadEnv();
  const raw = ADMIN_PASETO_LOCAL_KEY.trim();

  const base64Buffer = attemptDecode(raw, "base64");
  if (base64Buffer) {
    cachedKey = ensureLength(base64Buffer);
    return cachedKey;
  }

  const hexBuffer = attemptDecode(raw, "hex");
  if (hexBuffer) {
    cachedKey = ensureLength(hexBuffer);
    return cachedKey;
  }

  const utf8Buffer = Buffer.from(raw, "utf8");
  cachedKey = ensureLength(utf8Buffer);
  return cachedKey;
}

function attemptDecode(value: string, encoding: BufferEncoding): Buffer | null {
  try {
    const decoded = Buffer.from(value, encoding);
    return decoded.length === 0 ? null : decoded;
  } catch {
    return null;
  }
}

function ensureLength(source: Buffer): Buffer {
  if (source.length < 32) {
    throw new Error("PASETO symmetric key must be at least 32 bytes");
  }
  return Buffer.from(source.subarray(0, 32));
}

export interface IssueTokenInput {
  subject: string;
  role: Role;
  sessionId: string;
}

export interface IssuedToken {
  token: string;
  expiresAt: Date;
}

export async function issueAccessToken({
  subject,
  role,
  sessionId,
}: IssueTokenInput): Promise<IssuedToken> {
  const payload = {
    sub: subject,
    role,
    sid: sessionId,
    jti: crypto.randomUUID(),
  };

  const token = await V3.encrypt(payload, getLocalKey(), {
    expiresIn: `${ACCESS_TOKEN_TTL_SECONDS}s`,
    iat: true,
  });

  const expiresAt = new Date(Date.now() + ACCESS_TOKEN_TTL_SECONDS * 1000);

  return { token, expiresAt };
}

export async function verifyAccessToken(token: string): Promise<TokenClaims> {
  const payload = tokenClaimsSchema.parse(
    await V3.decrypt(token, getLocalKey())
  );
  const now = Date.now();

  if (payload.exp.getTime() < now) {
    throw new Error("Token expired");
  }

  return payload;
}
