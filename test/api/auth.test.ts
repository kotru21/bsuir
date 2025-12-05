import { describe, it, expect, vi, beforeEach, afterEach } from "bun:test";
import {
  fetchSession,
  fetchCsrfToken,
  loginRequest,
  logoutRequest,
} from "../../admin/web/src/api/auth.js";

describe("auth API", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("fetchSession returns session data", async () => {
    const mockSession = { authenticated: true, username: "admin" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockSession)),
    }) as unknown as typeof global.fetch;

    const result = await fetchSession();
    expect(result).toEqual(mockSession);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/session"),
      expect.any(Object)
    );
  });

  it("fetchCsrfToken extracts token from response", async () => {
    const mockResponse = { token: "csrf-token-123" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockResponse)),
    }) as unknown as typeof global.fetch;

    const result = await fetchCsrfToken();
    expect(result).toBe("csrf-token-123");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/csrf"),
      expect.any(Object)
    );
  });

  it("loginRequest sends credentials with POST", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ success: true })),
    }) as unknown as typeof global.fetch;

    await loginRequest({
      username: "user",
      password: "pass",
      csrfToken: "token",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/login"),
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("logoutRequest sends POST with csrf token", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ success: true })),
    }) as unknown as typeof global.fetch;

    await logoutRequest("csrf-token");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/logout"),
      expect.objectContaining({
        method: "POST",
      })
    );
  });
});
