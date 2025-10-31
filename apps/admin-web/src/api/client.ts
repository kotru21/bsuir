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

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const payload = loginRequestSchema.parse(request);

  const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await response.json();
  return loginResponseSchema.parse(data);
}

export async function fetchStatsOverview(
  accessToken: string
): Promise<StatsOverview> {
  const response = await fetch(`${getApiBaseUrl()}/api/stats/overview`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load overview stats");
  }

  const data = await response.json();
  return statsOverviewSchema.parse(data);
}
