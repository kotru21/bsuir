/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("../../admin/web/src/api/stats.js", () => ({
  fetchOverview: vi.fn(),
  fetchDemographics: vi.fn(),
  fetchTimeline: vi.fn(),
}));

import {
  fetchOverview,
  fetchDemographics,
  fetchTimeline,
} from "../../admin/web/src/api/stats.js";
import { useOverviewStats } from "../../admin/web/src/hooks/useOverviewStats.js";
import { translateGenderPlural } from "../../admin/web/src/localization.js";

function TestComponent({ rangeDays = 30 }: { rangeDays?: number }) {
  const s = useOverviewStats(rangeDays);
  return (
    <div>
      <div data-testid="loading">{s.loading ? "loading" : "ok"}</div>
      <div data-testid="gender">{JSON.stringify(s.genderDistribution)}</div>
      <div data-testid="formats">{JSON.stringify(s.topFormats)}</div>
      <div data-testid="goals">{JSON.stringify(s.topGoals)}</div>
      <div data-testid="timeline">{JSON.stringify(s.timelinePoints)}</div>
    </div>
  );
}

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

describe("useOverviewStats", () => {
  const OVERVIEW_MOCK = {
    totalSubmissions: 100,
    submissionsLast7Days: 10,
    averageAge: 23.5,
    genderDistribution: { male: 60, female: 40 },
    fitnessDistribution: { low: 2, medium: 3, high: 5 },
    contactPreference: { avoidContact: 1, allowContact: 2 },
    competitionInterest: { interested: 5, notInterested: 95 },
    formatLeaders: [{ format: "individual", count: 20 }],
    goalLeaders: [{ goal: "strength", count: 10 }],
    lastSubmissionAt: null,
    aiSummaryStats: { withSummary: 1, withoutSummary: 0, coveragePercent: 100 },
  };

  const DEMOGRAPHICS_MOCK = {
    ageBuckets: [{ label: "18-24", count: 12 }],
    genderByFitness: [],
    goalOverlap: [],
  };

  const TIMELINE_MOCK = { points: [{ date: "2020-01-01", submissions: 1 }] };

  beforeEach(() => {
    (fetchOverview as unknown as any).mockResolvedValue(OVERVIEW_MOCK);
    (fetchDemographics as unknown as any).mockResolvedValue(DEMOGRAPHICS_MOCK);
    (fetchTimeline as unknown as any).mockResolvedValue(TIMELINE_MOCK);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("fetches and returns combined overview values", async () => {
    const client = makeQueryClient();
    render(
      <QueryClientProvider client={client}>
        <TestComponent />
      </QueryClientProvider>
    );

    // Initially loading
    expect(screen.getByTestId("loading").textContent).toBe("loading");

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("ok")
    );

    // genderDistribution should include keys
    const gender = screen.getByTestId("gender").textContent;
    expect(gender).toContain(translateGenderPlural("male"));
    expect(gender).toContain(translateGenderPlural("female"));

    // topFormats maps the format key to object with key
    const formats = JSON.parse(
      screen.getByTestId("formats").textContent || "[]"
    );
    expect(Array.isArray(formats)).toBeTruthy();
    expect(formats[0].key).toBe("individual");
    expect(formats[0].count).toBe(20);

    const goals = JSON.parse(screen.getByTestId("goals").textContent || "[]");
    expect(goals[0].key).toBe("strength");
    expect(goals[0].count).toBe(10);

    const timeline = JSON.parse(
      screen.getByTestId("timeline").textContent || "[]"
    );
    expect(timeline[0].date).toBe("2020-01-01");
  });
});
