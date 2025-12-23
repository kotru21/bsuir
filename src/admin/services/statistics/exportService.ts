import * as json2csv from "json-2-csv";
import * as XLSX from "xlsx";
import { getPrismaClient } from "../../../infrastructure/prismaClient.js";
import type { SubmissionListItem, SubmissionEntity } from "./types.js";

export async function fetchAllSubmissions(): Promise<SubmissionListItem[]> {
  const prisma = getPrismaClient();

  const entries = await prisma.surveySubmission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      recommendations: {
        orderBy: { rank: "asc" },
      },
    },
  });

  const typedEntries = entries as SubmissionEntity[];

  const items: SubmissionListItem[] = typedEntries.map((submission) => {
    const recommendations = submission.recommendations ?? [];
    const aiSummary = submission.aiSummary ?? null;

    return {
      id: submission.id,
      createdAt: submission.createdAt.toISOString(),
      profile: {
        age: submission.age,
        gender: submission.gender,
        fitnessLevel: submission.fitnessLevel,
        preferredFormats: submission.preferredFormats,
        desiredGoals: submission.desiredGoals,
        avoidContact: submission.avoidContact,
        interestedInCompetition: submission.interestedInCompetition,
      },
      aiSummary: aiSummary ?? null,
      recommendations: recommendations.map((r) => ({
        sectionId: r.sectionId,
        sectionName: r.sectionName,
        score: r.score,
        rank: r.rank,
        reasons: r.reasons,
      })),
    } as SubmissionListItem;
  });

  return items;
}

function flattenForCsv(item: SubmissionListItem) {
  return {
    id: item.id,
    createdAt: item.createdAt,
    age: item.profile.age,
    gender: item.profile.gender,
    fitnessLevel: item.profile.fitnessLevel,
    preferredFormats: (item.profile.preferredFormats || []).join(";") as string,
    desiredGoals: (item.profile.desiredGoals || []).join(";") as string,
    avoidContact: String(item.profile.avoidContact),
    interestedInCompetition: String(item.profile.interestedInCompetition),
    aiSummary: item.aiSummary ?? "",
    recommendations: JSON.stringify(item.recommendations || []),
  };
}

export function buildJsonString(items: SubmissionListItem[]): string {
  return JSON.stringify(items, null, 2);
}

export async function buildCsvString(items: SubmissionListItem[]): Promise<string> {
  const flattened = items.map(flattenForCsv);
  // Add BOM for Excel compatibility
  const csv = await Promise.resolve(json2csv.json2csv(flattened, { prependHeader: true }));
  return "\uFEFF" + csv;
}

export async function buildXlsxBuffer(items: SubmissionListItem[]): Promise<Buffer> {
  const headers = [
    "id",
    "createdAt",
    "age",
    "gender",
    "fitnessLevel",
    "preferredFormats",
    "desiredGoals",
    "avoidContact",
    "interestedInCompetition",
    "aiSummary",
    "recommendations",
  ];

  const rows = items.map((item) => [
    item.id,
    item.createdAt,
    item.profile.age,
    item.profile.gender,
    item.profile.fitnessLevel,
    (item.profile.preferredFormats || []).join(";") as string,
    (item.profile.desiredGoals || []).join(";") as string,
    item.profile.avoidContact,
    item.profile.interestedInCompetition,
    item.aiSummary ?? "",
    JSON.stringify(item.recommendations || []),
  ]);

  const aoa = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "submissions");
  const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return Buffer.from(arrayBuffer as ArrayBuffer);
} 

export async function exportSubmissions(
  format: "json" | "csv" | "xlsx"
): Promise<{ buffer: Buffer; filename: string; contentType: string }> {
  const items = await fetchAllSubmissions();
  const date = new Date().toISOString().slice(0, 10);
  const filename = `submissions-${date}.${format}`;

  if (format === "json") {
    const body = buildJsonString(items);
    return { buffer: Buffer.from(body, "utf8"), filename, contentType: "application/json; charset=utf-8" };
  }

  if (format === "csv") {
    const csv = await buildCsvString(items);
    return { buffer: Buffer.from(csv, "utf8"), filename, contentType: "text/csv; charset=utf-8" };
  }

  // xlsx
  const buffer = await buildXlsxBuffer(items);
  return { buffer, filename, contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
}

// Overview exports
export function buildOverviewJsonString(overview: unknown): string {
  return JSON.stringify(overview, null, 2);
}

export async function buildOverviewCsvString(overview: Record<string, unknown>): Promise<string> {
  const rows: { key: string; value: string }[] = [];
  for (const [k, v] of Object.entries(overview)) {
    if (typeof v === "object" && v !== null) {
      rows.push({ key: k, value: JSON.stringify(v) });
    } else {
      rows.push({ key: k, value: String(v) });
    }
  }
  const csv = await Promise.resolve(json2csv.json2csv(rows, { keys: ["key", "value"] }));
  return "\uFEFF" + csv;
}

export async function buildOverviewXlsxBuffer(overview: Record<string, unknown>): Promise<Buffer> {
  const headers = ["key", "value"];
  const rows = Object.entries(overview).map(([k, v]) => [k, typeof v === "object" && v !== null ? JSON.stringify(v) : String(v)]);
  const aoa = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "overview");
  const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return Buffer.from(arrayBuffer as ArrayBuffer);
}

export async function exportOverview(
  format: "json" | "csv" | "xlsx",
  overviewData: unknown
): Promise<{ buffer: Buffer; filename: string; contentType: string }> {
  const date = new Date().toISOString().slice(0, 10);
  const filename = `overview-${date}.${format}`;

  if (format === "json") {
    const body = buildOverviewJsonString(overviewData);
    return { buffer: Buffer.from(body, "utf8"), filename, contentType: "application/json; charset=utf-8" };
  }

  if (format === "csv") {
    const csv = await buildOverviewCsvString(overviewData as Record<string, unknown>);
    return { buffer: Buffer.from(csv, "utf8"), filename, contentType: "text/csv; charset=utf-8" };
  }

  const buffer = await buildOverviewXlsxBuffer(overviewData as Record<string, unknown>);
  return { buffer, filename, contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
}
