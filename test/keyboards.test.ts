import { describe, it, expect } from "vitest";
import { buildRecommendationKeyboard } from "../src/bot/keyboards.js";

describe("keyboards", () => {
  it("recommendation keyboard contains feedback buttons", () => {
    const kb = buildRecommendationKeyboard("athletic-gymnastics");
    expect(kb.reply_markup.inline_keyboard.length).toBeGreaterThanOrEqual(2);
    const feedbackRow = kb.reply_markup.inline_keyboard[1];
    expect(feedbackRow[0].text).toContain("Помогла");
    expect(feedbackRow[1].text).toContain("Не помогла");
  });
});
