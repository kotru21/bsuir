import { describe, it, expect, vi, beforeEach, afterEach } from "bun:test";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("../../admin/web/src/api/stats.js", () => ({
  // keep names in sync with module imports
  fetchSubmissions: vi.fn().mockResolvedValue({ items: [], pagination: { total: 0, totalPages: 1 } }),
  exportSubmissions: vi.fn().mockResolvedValue({ blob: new Blob(["a,b\n1,2"], { type: "text/csv" }), filename: "submissions-2025-12-23.csv", contentType: "text/csv; charset=utf-8" }),
  exportOverview: vi.fn().mockResolvedValue({ blob: new Blob(["{}"], { type: "application/json" }), filename: "overview-2025-12-23.json", contentType: "application/json; charset=utf-8" }),
  fetchOverview: vi.fn().mockResolvedValue({
    totalSubmissions: 0,
    submissionsLast7Days: 0,
    averageAge: null,
    genderDistribution: {},
    fitnessDistribution: {},
    contactPreference: { avoidContact: 0, allowContact: 0 },
    competitionInterest: { interested: 0, notInterested: 0 },
    formatLeaders: [],
    goalLeaders: [],
    lastSubmissionAt: null,
    aiSummaryStats: { withSummary: 0, withoutSummary: 0, coveragePercent: 0 },
  }),
  fetchDemographics: vi.fn().mockResolvedValue({ ageBuckets: [], genderByFitness: [], goalOverlap: [] }),
  fetchTimeline: vi.fn().mockResolvedValue({ points: [] }),
}));

// stub react-chartjs-2 components to avoid chart.js DOM context errors in tests
vi.mock("react-chartjs-2", () => ({
  Bar: (_props: Record<string, unknown>) => {
    return (<div data-testid="bar-chart" />);
  },
  Doughnut: (_props: Record<string, unknown>) => {
    return (<div data-testid="doughnut-chart" />);
  },
  Line: (_props: Record<string, unknown>) => {
    return (<div data-testid="line-chart" />);
  },
  Pie: (_props: Record<string, unknown>) => {
    return (<div data-testid="pie-chart" />);
  },
  Radar: (_props: Record<string, unknown>) => {
    return (<div data-testid="radar-chart" />);
  },
}));

// NOTE: import pages lazily to ensure mocked module used
import { SubmissionsPage } from "../../admin/web/src/pages/SubmissionsPage.js";
import { DashboardPage } from "../../admin/web/src/pages/DashboardPage.js";

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

describe("Admin export buttons UI", () => {
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    originalCreateElement = document.createElement;
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    vi.restoreAllMocks();
  });

  it("SubmissionsPage export triggers API and initiates download", async () => {
    const exports = (await import("../../admin/web/src/api/stats.js")) as typeof import("../../admin/web/src/api/stats.js");
    const exportSubmissions = exports.exportSubmissions;

    let createdAnchor: HTMLAnchorElement | null = null;
    const clickSpy = vi.fn();

    document.createElement = ((tag: string) => {
      if (tag === "a") {
        const a = originalCreateElement.call(document, tag) as HTMLAnchorElement;
        createdAnchor = a;
        a.click = clickSpy as unknown as () => void;
        return a;
      }
      return originalCreateElement.call(document, tag);
    }) as typeof document.createElement;

    const client = makeQueryClient();
    const { container: _container } = render(
      <QueryClientProvider client={client}>
        {<SubmissionsPage />}
      </QueryClientProvider>
    );

    // Wait for the page to finish initial load and show export control
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Экспорт/i })).toBeTruthy();
    });

    const exportButton = screen.getByRole("button", { name: /Экспорт/i });
    fireEvent.click(exportButton);

    const csvOption = await screen.findByText(/CSV/);
    fireEvent.click(csvOption);

    await waitFor(() => {
      expect(exportSubmissions).toHaveBeenCalledWith("csv");
      expect(createdAnchor).not.toBeNull();
      expect(createdAnchor?.download).toBe("submissions-2025-12-23.csv");
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  it("DashboardPage export triggers API and initiates download", async () => {
    const exports = (await import("../../admin/web/src/api/stats.js")) as typeof import("../../admin/web/src/api/stats.js");
    const exportOverview = exports.exportOverview;

    let createdAnchor: HTMLAnchorElement | null = null;
    const clickSpy = vi.fn();

    document.createElement = ((tag: string) => {
      if (tag === "a") {
        const a = originalCreateElement.call(document, tag) as HTMLAnchorElement;
        createdAnchor = a;
        a.click = clickSpy as unknown as () => void;
        return a;
      }
      return originalCreateElement.call(document, tag);
    }) as typeof document.createElement;

    const client = makeQueryClient();
    const { container: _container } = render(
      <QueryClientProvider client={client}>
        {<DashboardPage />}
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Экспорт/i })).toBeTruthy();
    });

    const exportButton = screen.getByRole("button", { name: /Экспорт/i });
    fireEvent.click(exportButton);

    const jsonOption = await screen.findByText(/JSON/);
    fireEvent.click(jsonOption);

    await waitFor(() => {
      expect(exportOverview).toHaveBeenCalledWith("json");
      expect(createdAnchor).not.toBeNull();
      expect(createdAnchor?.download).toBe("overview-2025-12-23.json");
      expect(clickSpy).toHaveBeenCalled();
    });
  });
});
