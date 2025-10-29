import fs from "fs";
import path from "path";

export function resolveImagePath(image: string): string | null {
  const abs = path.resolve(process.cwd(), image);
  if (fs.existsSync(abs)) {
    return abs;
  }

  const altSrc = path.resolve(
    process.cwd(),
    "src",
    image.replace(/^\.\/[\\/]?/, "")
  );
  if (fs.existsSync(altSrc)) {
    return altSrc;
  }

  const altDist = path.resolve(
    process.cwd(),
    "dist",
    image.replace(/^\.\/[\\/]?/, "")
  );
  if (fs.existsSync(altDist)) {
    return altDist;
  }

  return null;
}
