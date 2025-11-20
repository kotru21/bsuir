import { describe, it, expect } from "bun:test";
import { resolveImagePath } from "../src/bot/services/imageResolver.js";
import path from "path";

describe("imageResolver", () => {
  it("resolves image path inside src/data/images", () => {
    const res = resolveImagePath("./data/images/wrestling.jpg");
    expect(res).toBeTruthy();
    expect(
      res && res.endsWith(path.join("src", "data", "images", "wrestling.jpg"))
    ).toBe(true);
  });

  it("returns null for path traversal attempts", () => {
    expect(resolveImagePath("../package.json")).toBeNull();
    expect(resolveImagePath("/etc/passwd")).toBeNull();
  });
});
