const API_BASE = "/admin/api";

export interface ApiError extends Error {
  status: number;
  payload?: unknown;
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  csrfToken?: string;
  skipJson?: boolean;
  body?: unknown;
}

function buildError(status: number, payload: unknown): ApiError {
  const error = new Error("Request failed") as ApiError;
  error.status = status;
  error.payload = payload;
  return error;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { csrfToken, skipJson, headers, body, method, ...rest } = options;
  const finalHeaders = new Headers(headers);
  finalHeaders.set("Accept", "application/json");

  const isJsonBody =
    body !== undefined &&
    body !== null &&
    typeof body === "object" &&
    !(body instanceof FormData);
  if (isJsonBody) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (csrfToken) {
    finalHeaders.set("x-csrf-token", csrfToken);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: method ?? "GET",
    credentials: "include",
    headers: finalHeaders,
    body: isJsonBody
      ? JSON.stringify(body)
      : (body as BodyInit | null | undefined) ?? null,
    ...rest,
  });

  if (!response.ok) {
    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch (err) {
      payload = await response.text();
    }
    throw buildError(response.status, payload);
  }

  if (skipJson || response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
