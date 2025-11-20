import { describe, it, expect } from "bun:test";
import { replyWithPhotoMarkdownV2Safe } from "../src/bot/telegram.js";

describe("replyWithPhotoMarkdownV2Safe", () => {
  it("truncates caption before sending", async () => {
    const captured: { extra?: Record<string, unknown> } = {};

    type FakeCtx = {
      replyWithPhoto: (
        source: unknown,
        extra?: Record<string, unknown>
      ) => Promise<void>;
    };

    const ctx: FakeCtx = {
      replyWithPhoto: async (
        _source: unknown,
        extra?: Record<string, unknown>
      ) => {
        captured.extra = extra;
        return Promise.resolve();
      },
    };

    const veryLong = "x".repeat(5000);
    await replyWithPhotoMarkdownV2Safe(ctx, () => ({ source: "a" }), {
      caption: veryLong,
      parse_mode: "MarkdownV2",
    });

    expect(captured.extra).toBeDefined();
    expect(captured.extra.caption.length).toBeLessThanOrEqual(4096);
  });
});
