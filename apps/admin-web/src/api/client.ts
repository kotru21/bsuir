import {
  loginRequestSchema,
  loginResponseSchema,
  statsOverviewSchema,
  type LoginRequest,
  type LoginResponse,
  type StatsOverview,
} from "@bsuir-admin/types";

const DEFAULT_API_BASE_URL = "http://localhost:4000";

function getApiBaseUrl(): string {
  const envValue = import.meta.env.VITE_ADMIN_API_URL;
  const raw =
    typeof envValue === "string" && envValue.length > 0
      ? envValue
      : DEFAULT_API_BASE_URL;
  return normalizeBaseUrl(raw);
}

// Ensure base URL has no trailing slash to avoid double slashes when building paths
function normalizeBaseUrl(raw: string): string {
  // remove trailing slashes only — keep leading protocol and host intact
  return raw.replace(/\/+$/g, "");
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const payload = loginRequestSchema.parse(request);

  const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!response.ok) {
    // Try to read error message returned by the API to provide better UX
    let message = response.statusText || `HTTP ${response.status}`;
    try {
      const err = await response.json();
      if (err && typeof err.message === "string") {
        message = err.message;
      }
    } catch (e) {
      // ignore JSON parse errors and keep statusText
    }
    throw new Error(message);
  }

  const data = await response.json();
  return loginResponseSchema.parse(data);
}

export async function refreshSession(): Promise<LoginResponse> {
  const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthorizedError();
    }
    throw new ApiError("Failed to refresh session", response.status);
  }

  const data = await response.json();
  return loginResponseSchema.parse(data);
}

export async function logout(): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok && response.status !== 204) {
    throw new ApiError("Failed to terminate session", response.status);
  }
}

export async function fetchStatsOverview(
  accessToken: string
): Promise<StatsOverview> {
  const response = await fetch(`${getApiBaseUrl()}/api/stats/overview`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthorizedError();
    }
    throw new Error("Unable to load overview stats");
  }

  const data = await response.json();
  return statsOverviewSchema.parse(data);
}
