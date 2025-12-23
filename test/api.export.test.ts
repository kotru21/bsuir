import { describe, it, expect, vi, beforeEach, afterEach } from "bun:test";
import { exportSubmissions, exportOverview } from "../admin/web/src/api/stats.js";

describe("client export api", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("requests export endpoint and returns blob and filename", async () => {
    global.fetch = vi.fn(async (url: string) => {
      expect(url).toContain("/admin/api/submissions/export");
      expect(url).toContain("format=csv");
      const headers = new Headers({
        "Content-Disposition": 'attachment; filename="submissions-2025-12-23.csv"',
        "Content-Type": "text/csv; charset=utf-8",
      });
      const blob = new Blob(["a,b,c\n1,2,3"], { type: "text/csv" });
      return new Response(blob, { status: 200, headers });
    }) as unknown as typeof global.fetch;

    const { blob, filename, contentType } = await exportSubmissions("csv");
    expect(blob instanceof Blob).toBe(true);
    expect(filename).toBe("submissions-2025-12-23.csv");
    expect(contentType).toBe("text/csv; charset=utf-8");
  });

  it("requests stats export endpoint and returns blob and filename", async () => {
    global.fetch = vi.fn(async (url: string) => {
      expect(url).toContain("/admin/api/stats/export");
      expect(url).toContain("format=json");
      const headers = new Headers({
        "Content-Disposition": 'attachment; filename="overview-2025-12-23.json"',
        "Content-Type": "application/json; charset=utf-8",
      });
      const blob = new Blob(["{\"totalSubmissions\":10}"], { type: "application/json" });
      return new Response(blob, { status: 200, headers });
    }) as unknown as typeof global.fetch;

    const { blob, filename, contentType } = await exportOverview("json");
    expect(blob instanceof Blob).toBe(true);
    expect(filename).toBe("overview-2025-12-23.json");
    expect(contentType).toBe("application/json; charset=utf-8");
  });
});
