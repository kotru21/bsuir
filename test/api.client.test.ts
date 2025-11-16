import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch } from "../admin/web/src/api/client.js";

describe("apiFetch", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("aborts when timeoutMs is reached", async () => {
    // fetch that never resolves
    global.fetch = vi.fn(() => new Promise(() => undefined)) as any;

    await expect(apiFetch("/test", { timeoutMs: 1 })).rejects.toMatchObject({
      status: 0,
    });
  });
});
