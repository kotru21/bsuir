import { describe, it, expect, beforeEach, afterEach, vi } from "bun:test";

describe("statistics export service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exports json, csv and xlsx for submissions", async () => {
    // mock prisma client
    vi.mock("../src/infrastructure/prismaClient.js", () => ({
      getPrismaClient: () => ({
        surveySubmission: {
          findMany: vi.fn().mockResolvedValue([
            {
              id: "1",
              createdAt: new Date("2025-12-23T10:00:00Z"),
              age: 30,
              gender: "female",
              fitnessLevel: "high",
              preferredFormats: ["individual"],
              desiredGoals: ["endurance"],
              avoidContact: false,
              interestedInCompetition: false,
              aiSummary: "AI summary text",
              recommendations: [
                {
                  sectionId: "sec1",
                  sectionName: "S1",
                  score: 80,
                  rank: 1,
                  reasons: ["good match"],
                },
              ],
            },
          ]),
        },
      }),
    }));

    const { exportSubmissions } = await import(
      "../src/admin/services/statistics/exportService.js"
    );

    const jsonResult = await exportSubmissions("json");
    expect(jsonResult.filename?.endsWith(".json")).toBe(true);
    const jsonStr = jsonResult.buffer.toString("utf8");
    expect(jsonStr).toContain('"id": "1"');
    expect(jsonStr).toContain("AI summary text");

    const csvResult = await exportSubmissions("csv");
    expect(csvResult.filename?.endsWith(".csv")).toBe(true);
    const csvStr = csvResult.buffer.toString("utf8");
    expect(csvStr).toContain("id");
    expect(csvStr).toContain("1");

    const xlsxResult = await exportSubmissions("xlsx");
    expect(xlsxResult.filename?.endsWith(".xlsx")).toBe(true);
    const buf = xlsxResult.buffer;
    // XLSX is a zip-based file and should start with PK
    expect(buf.length).toBeGreaterThan(0);
    expect(buf.slice(0, 2).toString()).toBe("PK");
  });
});
