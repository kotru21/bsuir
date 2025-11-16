const API_BASE = "/admin/api";

export interface ApiError extends Error {
  status: number;
  payload?: unknown;
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  csrfToken?: string;
  skipJson?: boolean;
  /** Optional timeout in milliseconds. When unset, no client-side timeout is applied. */
  timeoutMs?: number;
  body?: unknown;
  suppressUnauthorizedEvent?: boolean;
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
  const {
    csrfToken,
    skipJson,
    headers,
    body,
    method,
    suppressUnauthorizedEvent,
    ...rest
  } = options;
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

  const controller = new AbortController();
  const userSignal = (rest as RequestInit).signal as AbortSignal | undefined;
  const signal = userSignal ?? controller.signal;

  let timeoutId: NodeJS.Timeout | undefined;
  if (!userSignal && options.timeoutMs && options.timeoutMs > 0) {
    timeoutId = setTimeout(() => controller.abort(), options.timeoutMs);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: method ?? "GET",
      credentials: "include",
      headers: finalHeaders,
      body: isJsonBody
        ? JSON.stringify(body)
        : (body as BodyInit | null | undefined) ?? null,
      signal,
      ...rest,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw buildError(0, { message: "Request aborted due to timeout" });
    }
    throw err;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  if (!response.ok) {
    if (
      response.status === 401 &&
      !suppressUnauthorizedEvent &&
      typeof window !== "undefined"
    ) {
      window.dispatchEvent(new CustomEvent("admin:unauthorized"));
    }
    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch (_err) {
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
