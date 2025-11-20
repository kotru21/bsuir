export function normalizeBasePath(basePath: string): string {
  if (!basePath || basePath === "/") {
    return "";
  }
  return basePath.startsWith("/") ? basePath : `/${basePath}`;
}

export function buildPrefixedPath(base: string, suffix: string): string {
  return `${base}${suffix}`.replace(/\/+/g, "/");
}

export function ensureTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

export function normalizeRelativePath(candidate: string): string | null {
  const normalized = candidate.replace(/\\/g, "/");
  const segments = normalized.split("/");
  const safeSegments: string[] = [];

  for (const segment of segments) {
    if (!segment || segment === "." || segment === "..") {
      continue;
    }
    safeSegments.push(segment);
  }

  return safeSegments.length > 0 ? safeSegments.join("/") : null;
}

export function buildAdminPath(basePath: string, suffix = ""): string {
  const normalizedBase = normalizeBasePath(basePath);
  if (!suffix) {
    return normalizedBase;
  }
  const normalizedSuffix = suffix.startsWith("/") ? suffix : `/${suffix}`;
  if (!normalizedBase) {
    return normalizedSuffix;
  }
  return buildPrefixedPath(normalizedBase, normalizedSuffix);
}

export function buildAdminApiPath(basePath: string, suffix = ""): string {
  const normalizedSuffix = suffix
    ? suffix.startsWith("/")
      ? suffix
      : `/${suffix}`
    : "";
  return buildAdminPath(basePath, `/api${normalizedSuffix}`);
}
