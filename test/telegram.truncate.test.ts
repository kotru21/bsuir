import { describe, it, expect, vi } from "vitest";
import { replyMarkdownV2Safe } from "../src/bot/telegram.js";

describe("telegram truncation", () => {
  it("truncates long messages before sending", async () => {
    const called: string[] = [];
    const ctx: any = {
      replyWithMarkdownV2: async (text: string) => {
        called.push(text);
      },
      reply: async (_text: string) => {
        // fallback
      },
    };

    const long = "x".repeat(5000);
    await replyMarkdownV2Safe(ctx, long);
    expect(called).toHaveLength(1);
    expect(called[0].length).toBeLessThanOrEqual(4096);
  });
});
