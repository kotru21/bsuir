import { describe, it, expect } from "vitest";
import {
  queryProfile,
  queryTopSectionIds,
} from "../src/services/contentRecommender.js";
import type { UserProfile } from "../src/types.js";

describe("contentRecommender", () => {
  it("returns a top section for strength goal", () => {
    const profile: UserProfile = {
      age: 21,
      gender: "unspecified",
      fitnessLevel: "medium",
      preferredFormats: [],
      desiredGoals: ["strength"],
      avoidContact: false,
      interestedInCompetition: false,
    };

    const recs = queryProfile(profile, 3);
    expect(recs.length).toBeGreaterThan(0);
    const top = recs[0];
    expect(top.matchedFocus).toContain("strength");
  });

  it("returns expected top ids via queryTopSectionIds", () => {
    const profile: UserProfile = {
      age: 19,
      gender: "unspecified",
      fitnessLevel: "low",
      preferredFormats: [],
      desiredGoals: ["endurance"],
      avoidContact: false,
      interestedInCompetition: false,
    };

    const ids = queryTopSectionIds(profile, 2);
    expect(ids.length).toBeGreaterThan(0);
    // content-based result should reflect the goal in matchedFocus for the top candidate
    const topId = ids[0].id;
    const allRecs = queryProfile(profile, 10);
    const { section } =
      allRecs.find((r) => r.section.id === topId) ?? allRecs[0];
    expect(section.focus).toContain("endurance");
  });
});
