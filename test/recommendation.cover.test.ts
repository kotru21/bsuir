import { describe, it, expect, vi } from "vitest";
import {
  recommendSections,
  fallbackSection,
  listAllSections,
} from "../src/recommendation.js";
import { sportSections } from "../prisma/data/sections.js";

vi.mock("../src/infrastructure/prismaClient.js", () => ({
  getPrismaClient: () => ({
    sportSection: {
      findMany: vi.fn().mockResolvedValue(sportSections),
    },
  }),
}));

import {
  escapeMarkdown,
  renderRecommendationSummary,
  renderRecommendationDetail,
} from "../src/bot/formatters.js";
import type { UserProfile } from "../src/types.js";

describe("recommendation engine coverage", () => {
  it("listAllSections returns sections and contains expected ids", async () => {
    const all = await listAllSections();
    expect(Array.isArray(all)).toBe(true);
    // expect some known ids from data/sections.ts
    const ids = all.map((s) => s.id);
    expect(ids).toContain("special-medical");
    expect(ids).toContain("wrestling");
  });

  it("avoidContact true excludes fullContact sections from recommendations", async () => {
    const profile: UserProfile = {
      age: 25,
      gender: "unspecified",
      fitnessLevel: "medium",
      preferredFormats: [],
      desiredGoals: [],
      avoidContact: true,
      interestedInCompetition: false,
    };

    const recs = await recommendSections(profile, 20);
    // none of the returned sections should be fullContact
    for (const r of recs) {
      expect(r.section.contactLevel).not.toBe("fullContact");
    }
  });

  it("interestedInCompetition and desiredGoals=competition surfaces competition-focused sections", async () => {
    const profile: UserProfile = {
      age: 21,
      gender: "unspecified",
      fitnessLevel: "medium",
      preferredFormats: [],
      desiredGoals: ["competition"],
      avoidContact: false,
      interestedInCompetition: true,
    };

    const recs = await recommendSections(profile, 5);
    expect(Array.isArray(recs)).toBe(true);
    const anyCompetition = recs.some(
      (r) =>
        r.reasons.some(
          (reason) =>
            reason.kind === "similarity-goal" &&
            reason.tags.includes("competition")
        ) || r.section.focus.includes("competition")
    );
    expect(anyCompetition).toBe(true);
  });

  it("preferredFormats individual surfaces individual-format sections (e.g., special-medical)", async () => {
    const profile: UserProfile = {
      age: 30,
      gender: "unspecified",
      fitnessLevel: "low",
      preferredFormats: ["individual"],
      desiredGoals: [],
      avoidContact: false,
      interestedInCompetition: false,
    };

    const recs = await recommendSections(profile, 10);
    const ids = recs.map((r) => r.section.id);
    // special-medical is listed as individual in data
    expect(ids).toContain("special-medical");
  });

  it("fallbackSection returns a result (or null) safely for a profile", async () => {
    const profile: UserProfile = {
      age: 40,
      gender: "unspecified",
      fitnessLevel: "medium",
      preferredFormats: [],
      desiredGoals: [],
      avoidContact: false,
      interestedInCompetition: false,
    };

    const fb = await fallbackSection(profile);
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

  it("renderRecommendationSummary/detail return non-empty strings", async () => {
    const all = await listAllSections();
    const first = all[0];
    const fakeRec: import("../src/types.js").RecommendationResult = {
      section: first,
      score: 0.92,
      reasons: [
        {
          kind: "similarity-goal",
          tags: first.focus.slice(0, 1) as import("../src/types.js").GoalTag[],
          contribution: 0.9,
        },
        { kind: "catalog-reference", note: "Причина теста" },
      ],
    };
    const summary = renderRecommendationSummary(1, fakeRec);
    const detail = renderRecommendationDetail(1, fakeRec);
    expect(typeof summary).toBe("string");
    expect(summary.length).toBeGreaterThan(0);
    expect(typeof detail).toBe("string");
    expect(detail.length).toBeGreaterThan(0);
  });
});
