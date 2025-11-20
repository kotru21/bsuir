import { AdminRequestContext } from "../http/context.js";
import type { HttpMethod } from "../http/types.js";
import type { ResolvedAdminConfig } from "../config.js";
import type { JwtManager } from "../http/jwt.js";

export type CredentialVerifier = (
  username: string,
  password: string
) => Promise<boolean>;

export interface ContextFactoryOptions {
  config: ResolvedAdminConfig;
  securityHeaders: Record<string, string>;
  jwtManager: JwtManager;
  credentialVerifier: CredentialVerifier;
}

export type CreateContext = (
  request: Request,
  url: URL,
  method: HttpMethod,
  params: Record<string, string>
) => AdminRequestContext;

export function createContextFactory(
  options: ContextFactoryOptions
): CreateContext {
  return (request, url, method, params) =>
    new AdminRequestContext({
      request,
      url,
      method,
      params,
      config: options.config,
      securityHeaders: options.securityHeaders,
      credentialVerifier: options.credentialVerifier,
      jwtManager: options.jwtManager,
    });
}
