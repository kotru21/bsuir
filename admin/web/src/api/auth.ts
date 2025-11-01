import { apiFetch } from "./client";

export interface SessionResponse {
  authenticated: boolean;
  username: string | null;
}

export interface LoginPayload {
  username: string;
  password: string;
  csrfToken: string;
}

export async function fetchSession(): Promise<SessionResponse> {
  return apiFetch<SessionResponse>("/session");
}

export async function fetchCsrfToken(): Promise<string> {
  const data = await apiFetch<{ token: string }>("/csrf");
  return data.token;
}

export async function loginRequest(payload: LoginPayload): Promise<void> {
  await apiFetch<{ success: boolean }>("/login", {
    method: "POST",
    body: payload,
    csrfToken: payload.csrfToken,
  });
}

export async function logoutRequest(csrfToken: string): Promise<void> {
  await apiFetch<{ success: boolean }>("/logout", {
    method: "POST",
    csrfToken,
  });
}
