import { describe, it, expect, vi, beforeEach, afterEach } from "bun:test";
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
    // fetch that never resolves — simulate fetch that listens to AbortSignal
    global.fetch = vi.fn(
      (...[_url, opts]) =>
        new Promise((_resolve, reject) => {
          const signal = (opts as RequestInit | undefined)?.signal as
            | AbortSignal
            | undefined;
          if (!signal) return; // will never resolve
          signal.addEventListener("abort", () => {
            const err = new Error("The user aborted a request.") as Error & {
              name?: string;
            };
            // match WHATWG fetch's AbortError name
            err.name = "AbortError";
            reject(err);
          });
        })
    ) as unknown as typeof global.fetch;

    await expect(apiFetch("/test", { timeoutMs: 1 })).rejects.toMatchObject({
      status: 0,
    });
  });
});
