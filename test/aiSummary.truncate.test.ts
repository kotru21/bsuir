import { describe, it, expect } from "vitest";
import { generateRecommendationSummary } from "../src/services/aiSummary.js";

describe("AI summary truncation", () => {
  it("truncates long content returned from inference API", async () => {
    const mockedEnv = {
      INFERENCE_KEY: "x",
      INFERENCE_MODEL_ID: "m",
      INFERENCE_URL: "http://example.com/chat/v1",
    };

    // We simulate the inference flow by mocking fetch on global
    const realFetch = global.fetch;
    global.fetch = (async () => {
      return {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "x".repeat(2000) } }],
        }),
      } as any;
    }) as any;

    const profile = { age: 20 } as any;
    const result = await generateRecommendationSummary(
      profile,
      [],
      mockedEnv as any
    );
    // requests with no recommendations should not attempt
    expect(result.attempted).toBe(false);

    // Now with recommendations
    const recs = [
      {
        section: {
          id: "1",
          title: "a",
          summary: "s",
          format: "group",
          intensity: "medium",
          focus: [],
          extraBenefits: [],
        },
        reasons: [],
      },
    ];

    const r2 = await generateRecommendationSummary(
      profile,
      recs as any,
      mockedEnv as any
    );
    expect(r2.attempted).toBe(true);
    expect(r2.content).toBeTruthy();
    expect(r2.content?.length).toBeLessThanOrEqual(1000);

    global.fetch = realFetch;
  });
});
