import { describe, it, expect, vi, beforeEach, afterEach } from "bun:test";
import {
  fetchOverview,
  fetchDemographics,
  fetchTimeline,
  fetchSubmissions,
} from "../../admin/web/src/api/stats.js";

describe("stats API", () => {
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("fetchOverview calls /stats/overview and returns data", async () => {
    const mockData = { totalSubmissions: 100, avgAge: 25 };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockData)),
    }) as unknown as typeof global.fetch;

    const result = await fetchOverview();
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/stats/overview"),
      expect.any(Object)
    );
  });

  it("fetchDemographics calls /stats/demographics", async () => {
    const mockData = { genderDistribution: { male: 50, female: 50 } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockData)),
    }) as unknown as typeof global.fetch;

    const result = await fetchDemographics();
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/stats/demographics"),
      expect.any(Object)
    );
  });

  it("fetchTimeline passes rangeDays parameter", async () => {
    const mockData = { points: [{ date: "2024-01-01", count: 5 }] };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockData)),
    }) as unknown as typeof global.fetch;

    const result = await fetchTimeline(30);
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("rangeDays=30"),
      expect.any(Object)
    );
  });

  it("fetchSubmissions passes page and pageSize parameters", async () => {
    const mockData = { items: [], total: 0 };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockData)),
    }) as unknown as typeof global.fetch;

    const result = await fetchSubmissions(2, 25);
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("page=2"),
      expect.any(Object)
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("pageSize=25"),
      expect.any(Object)
    );
  });
});
