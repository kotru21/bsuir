export const AGE_BUCKETS: { label: string; from: number; to: number | null }[] =
  [
    { label: "До 17", from: 0, to: 17 },
    { label: "18-25", from: 18, to: 25 },
    { label: "26-35", from: 26, to: 35 },
    { label: "36-45", from: 36, to: 45 },
    { label: "46+", from: 46, to: null },
  ];

export function isRecoverablePrismaError(err: unknown): boolean {
  if (!err || typeof err !== "object") {
    return false;
  }

  const errorLike = err as { code?: unknown; name?: unknown };
  const code = typeof errorLike.code === "string" ? errorLike.code : undefined;
  const name = typeof errorLike.name === "string" ? errorLike.name : undefined;

  if (code && ["P2021", "P2022", "P1010", "P1001"].includes(code)) {
    return true;
  }

  return (
    name === "PrismaClientInitializationError" ||
    name === "PrismaClientUnknownRequestError"
  );
}

export function logAndReturn<T>(err: unknown, fallback: T): T {
  console.warn("Prisma statistics query failed, returning fallback", err);
  return fallback;
}

export function toNumber(value: bigint | number | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === "bigint") {
    return Number(value);
  }
  return value;
}

export function normalizeFormats(
  formats: string[] | null | undefined
): string[] {
  return Array.isArray(formats)
    ? formats.map((item) => item.toLowerCase())
    : [];
}

export function normalizeGoals(goals: string[] | null | undefined): string[] {
  return Array.isArray(goals) ? goals.map((item) => item.toLowerCase()) : [];
}
