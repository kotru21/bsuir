import { describe, it, expect } from "bun:test";
import { exportOverview } from "../src/admin/services/statistics/exportService.js";

describe("overview export", () => {
  it("exports overview data to json, csv and xlsx", async () => {
    const sample = {
      totalSubmissions: 10,
      submissionsLast7Days: 2,
      averageAge: 25.5,
      genderDistribution: { male: 6, female: 4 },
    } as const;

    const jsonResult = await exportOverview("json", sample);
    expect(jsonResult.filename?.endsWith(".json")).toBe(true);
    const jsonStr = jsonResult.buffer.toString("utf8");
    expect(jsonStr).toContain('"totalSubmissions": 10');

    const csvResult = await exportOverview("csv", sample);
    expect(csvResult.filename?.endsWith(".csv")).toBe(true);
    const csvStr = csvResult.buffer.toString("utf8");
    expect(csvStr).toContain("key");
    expect(csvStr).toContain("totalSubmissions");

    const xlsxResult = await exportOverview("xlsx", sample);
    expect(xlsxResult.filename?.endsWith(".xlsx")).toBe(true);
    const buf = xlsxResult.buffer;
    expect(buf.length).toBeGreaterThan(0);
    expect(buf.slice(0, 2).toString()).toBe("PK");
  });
});
