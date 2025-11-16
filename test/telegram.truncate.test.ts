import { describe, it, expect } from "vitest";
import { replyMarkdownV2Safe } from "../src/bot/telegram.js";

describe("telegram truncation", () => {
  it("truncates long messages before sending", async () => {
    const called: string[] = [];
    type FakeCtx = {
      replyWithMarkdownV2: (
        text: string,
        extra?: Record<string, unknown>
      ) => Promise<void>;
      reply: (text: string, extra?: Record<string, unknown>) => Promise<void>;
    };

    const ctx: FakeCtx = {
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
