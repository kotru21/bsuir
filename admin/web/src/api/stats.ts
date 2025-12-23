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

export async function exportSubmissions(
  format: "json" | "csv" | "xlsx"
): Promise<{ blob: Blob; filename: string | null; contentType: string | null }> {
  const params = new URLSearchParams({ format });
  const res = await fetch(`/admin/api/submissions/export?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch (_err) {
      payload = await res.text();
    }
    const e = new Error("Export failed") as Error & { status?: number; payload?: unknown };
    e.status = res.status;
    e.payload = payload;
    throw e;
  }

  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition");
  let filename: string | null = null;
  if (disposition) {
    const match = /filename\*?=(?:UTF-8''|")?([^;"]+)/i.exec(disposition);
    if (match) filename = decodeURIComponent(match[1]);
  }
  return { blob, filename, contentType: res.headers.get("Content-Type") };
}

export async function exportOverview(
  format: "json" | "csv" | "xlsx"
): Promise<{ blob: Blob; filename: string | null; contentType: string | null }> {
  const params = new URLSearchParams({ format });
  const res = await fetch(`/admin/api/stats/export?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch (_err) {
      payload = await res.text();
    }
    const e = new Error("Export failed") as Error & { status?: number; payload?: unknown };
    e.status = res.status;
    e.payload = payload;
    throw e;
  }

  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition");
  let filename: string | null = null;
  if (disposition) {
    const match = /filename\*?=(?:UTF-8''|")?([^;"]+)/i.exec(disposition);
    if (match) filename = decodeURIComponent(match[1]);
  }
  return { blob, filename, contentType: res.headers.get("Content-Type") };
}
