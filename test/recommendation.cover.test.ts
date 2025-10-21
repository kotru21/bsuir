import { describe, it, expect } from "vitest";
import {
  recommendSections,
  fallbackSection,
  listAllSections,
} from "../src/recommendation.js";
import {
  escapeMarkdown,
  renderRecommendationSummary,
  renderRecommendationDetail,
} from "../src/bot/formatters.js";
import type { UserProfile } from "../src/types.js";

describe("recommendation engine coverage", () => {
  it("listAllSections returns sections and contains expected ids", () => {
    const all = listAllSections();
    expect(Array.isArray(all)).toBe(true);
    // expect some known ids from data/sections.ts
    const ids = all.map((s) => s.id);
    expect(ids).toContain("special-medical");
    expect(ids).toContain("wrestling");
  });

  it("avoidContact true excludes fullContact sections from recommendations", () => {
    const profile: UserProfile = {
      age: 25,
      gender: "unspecified",
      fitnessLevel: "medium",
      preferredFormats: [],
      desiredGoals: [],
      avoidContact: true,
      interestedInCompetition: false,
    };

    const recs = recommendSections(profile, 20);
    // none of the returned sections should be fullContact
    for (const r of recs) {
      expect(r.section.contactLevel).not.toBe("fullContact");
    }
  });

  it("interestedInCompetition and desiredGoals=competition surfaces competition-focused sections", () => {
    const profile: UserProfile = {
      age: 21,
      gender: "unspecified",
      fitnessLevel: "medium",
      preferredFormats: [],
      desiredGoals: ["competition"],
      avoidContact: false,
      interestedInCompetition: true,
    };

    const recs = recommendSections(profile, 5);
    expect(Array.isArray(recs)).toBe(true);
    // At least one recommended section should have matchedFocus including 'competition'
    const anyCompetition = recs.some(
      (r) =>
        r.matchedFocus.includes("competition") ||
        r.section.focus.includes("competition")
    );
    expect(anyCompetition).toBe(true);
  });

  it("preferredFormats individual surfaces individual-format sections (e.g., special-medical)", () => {
    const profile: UserProfile = {
      age: 30,
      gender: "unspecified",
      fitnessLevel: "low",
      preferredFormats: ["individual"],
      desiredGoals: [],
      avoidContact: false,
      interestedInCompetition: false,
    };

    const recs = recommendSections(profile, 10);
    const ids = recs.map((r) => r.section.id);
    // special-medical is listed as individual in data
    expect(ids).toContain("special-medical");
  });

  it("fallbackSection returns a result (or null) safely for a profile", () => {
    const profile: UserProfile = {
      age: 40,
      gender: "unspecified",
      fitnessLevel: "medium",
      preferredFormats: [],
      desiredGoals: [],
      avoidContact: false,
      interestedInCompetition: false,
    };

    const fb = fallbackSection(profile);
    // either null (no eligible) or an object with section
    if (fb !== null) {
      expect(fb).toHaveProperty("section");
      expect(typeof fb.score).toBe("number");
    }
  });
});

describe("formatters", () => {
  it("escapeMarkdown actually escapes MarkdownV2 characters", () => {
    const raw = "test _*[]()~`>#+=|{}.!\\";
    const escaped = escapeMarkdown(raw);
    // escaped string should contain backslashes for at least a couple of special chars
    expect(escaped).not.toBe(raw);
    expect(escaped.includes("\\_") || escaped.includes("\\*")).toBe(true);
  });

  it("renderRecommendationSummary/detail return non-empty strings", () => {
    const all = listAllSections();
    const first = all[0];
    const fakeRec: import("../src/types.js").RecommendationResult = {
      section: first,
      score: 5,
      matchedFocus: first.focus.slice(0, 1),
      formatMatch: true,
      reason: ["Причина теста"],
    };
    const summary = renderRecommendationSummary(1, fakeRec);
    const detail = renderRecommendationDetail(1, fakeRec);
    expect(typeof summary).toBe("string");
    expect(summary.length).toBeGreaterThan(0);
    expect(typeof detail).toBe("string");
    expect(detail.length).toBeGreaterThan(0);
  });
});
