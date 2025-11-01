import { apiFetch } from "./client";
import type {
  DemographicStats,
  OverviewStats,
  SubmissionListResponse,
  TimelinePoint,
} from "../types/stats";

export function fetchOverview(): Promise<OverviewStats> {
  return apiFetch<OverviewStats>("/stats/overview");
}

export function fetchDemographics(): Promise<DemographicStats> {
  return apiFetch<DemographicStats>("/stats/demographics");
}

export function fetchTimeline(
  rangeDays: number
): Promise<{ points: TimelinePoint[] }> {
  const params = new URLSearchParams({ rangeDays: String(rangeDays) });
  return apiFetch<{ points: TimelinePoint[] }>(
    `/stats/timeline?${params.toString()}`
  );
}

export function fetchSubmissions(
  page: number,
  pageSize: number
): Promise<SubmissionListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  return apiFetch<SubmissionListResponse>(`/submissions?${params.toString()}`);
}
