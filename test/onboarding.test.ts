import { describe, it, expect } from "vitest";
import { clampAge, parseAgeDelta } from "../src/bot/scenes/onboarding.js";
import { AGE_MIN, AGE_MAX } from "../src/bot/constants.js";

describe("onboarding helpers", () => {
  it("clampAge clamps below min and above max", () => {
    expect(clampAge(AGE_MIN - 10)).toBe(AGE_MIN);
    expect(clampAge(AGE_MAX + 10)).toBe(AGE_MAX);
    expect(
      clampAge(Math.floor((AGE_MIN + AGE_MAX) / 2))
    ).toBeGreaterThanOrEqual(AGE_MIN);
  });

  it("parseAgeDelta parses numeric strings and returns null on invalid", () => {
    expect(parseAgeDelta("5")).toBe(5);
    expect(parseAgeDelta("-1")).toBe(-1);
    expect(parseAgeDelta("abc")).toBeNull();
  });
});
