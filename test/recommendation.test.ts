import { describe, it, expect } from "vitest";
import { recommendSections } from "../src/recommendation.js";
import type { UserProfile } from "../src/types.js";

describe("recommendSections", () => {
  it("returns an array of RecommendationResult for valid profile", () => {
    const profile: UserProfile = {
      age: 20,
      gender: "unspecified",
      fitnessLevel: "medium",
      preferredFormats: [],
      desiredGoals: [],
      avoidContact: false,
      interestedInCompetition: false,
    };

    const results = recommendSections(profile, 3);
    expect(Array.isArray(results)).toBe(true);
    // If there are sections defined, ensure each result has required shape
    if (results.length > 0) {
      const r = results[0];
      expect(r).toHaveProperty("section");
      expect(r).toHaveProperty("score");
      expect(typeof r.score).toBe("number");
    }
  });

  it("supports tfidf mode via RECOMMENDER_MODE", () => {
    const profile: UserProfile = {
      age: 20,
      gender: "unspecified",
      fitnessLevel: "medium",
      preferredFormats: [],
      desiredGoals: ["strength"],
      avoidContact: false,
      interestedInCompetition: false,
    };

    process.env.RECOMMENDER_MODE = "tfidf";
    const tf = recommendSections(profile, 3);
    expect(tf.length).toBeGreaterThan(0);
    expect(tf[0].matchedFocus).toContain("strength");
    delete process.env.RECOMMENDER_MODE;
  });

  it("includes schedule preference in boosting score", () => {
    const profile = {
      age: 23,
      gender: "unspecified",
      fitnessLevel: "medium",
      preferredFormats: [],
      desiredGoals: ["strength"],
      avoidContact: false,
      interestedInCompetition: false,
      preferredTimes: ["morning"],
    } as UserProfile;

    const recs = recommendSections(profile, 5);
    // If morning was included, at least one morning-available section should be in results
    const hasMorning = recs.some((r) =>
      r.section.scheduleTags?.includes("morning")
    );
    expect(hasMorning).toBe(true);
  });

  it("prefers wrestling for evening preference", () => {
    const profile: UserProfile = {
      age: 22,
      gender: "unspecified",
      fitnessLevel: "high",
      preferredFormats: [],
      desiredGoals: ["martialArts"],
      avoidContact: false,
      interestedInCompetition: false,
      preferredTimes: ["evening"],
    } as UserProfile;

    const recs = recommendSections(profile, 3);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].section.id).toBe("wrestling");
  });
});
