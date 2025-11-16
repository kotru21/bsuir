import fs from "fs";
import path from "path";

// Restrict images to known, safe directories inside the repository.
// This prevents directory traversal and arbitrary file reads by the bot.
const ALLOWED_DIRS = [
  path.resolve(process.cwd(), "src", "data", "images"),
  path.resolve(process.cwd(), "data", "images"),
  path.resolve(process.cwd(), "dist", "data", "images"),
];

function isInside(base: string, resolved: string): boolean {
  const normalizedBase = base.endsWith(path.sep) ? base : base + path.sep;
  const normalizedResolved = resolved.endsWith(path.sep)
    ? resolved
    : resolved + path.sep;
  return normalizedResolved.startsWith(normalizedBase);
}

export function resolveImagePath(image: string): string | null {
  // Do not allow absolute paths or parent-directory traversals
  if (path.isAbsolute(image) || image.includes("..")) {
    return null;
  }

  const normalized = image.replace(/^\.\/[\\/]?/, "");

  const candidates = [
    path.resolve(process.cwd(), normalized),
    path.resolve(process.cwd(), "src", normalized),
    path.resolve(process.cwd(), "dist", normalized),
  ];

  for (const candidate of candidates) {
    try {
      // locate only inside allowed folders
      for (const base of ALLOWED_DIRS) {
        if (!isInside(base, candidate)) continue;
        if (fs.existsSync(candidate)) return candidate;
      }
    } catch (_err) {
      // ignore
    }
  }

  return null;
}
