import { describe, it, expect, vi } from "bun:test";
import { recommendSections } from "../src/recommendation.js";
import type { UserProfile } from "../src/types.js";
import { sportSections } from "../prisma/data/sections.js";

vi.mock("../src/infrastructure/prismaClient.js", () => ({
  getPrismaClient: () => ({
    sportSection: {
      findMany: vi.fn().mockResolvedValue(sportSections),
    },
  }),
}));

describe("recommendSections", () => {
  it("returns an array of RecommendationResult for valid profile", async () => {
    const profile: UserProfile = {
      age: 20,
      gender: "unspecified",
      fitnessLevel: "medium",
      preferredFormats: [],
      desiredGoals: [],
      avoidContact: false,
      interestedInCompetition: false,
    };

    const results = await recommendSections(profile, 3);
    expect(Array.isArray(results)).toBe(true);
    // If there are sections defined, ensure each result has required shape
    if (results.length > 0) {
      const r = results[0];
      expect(r).toHaveProperty("section");
      expect(r).toHaveProperty("score");
      expect(typeof r.score).toBe("number");
    }
  });
});
