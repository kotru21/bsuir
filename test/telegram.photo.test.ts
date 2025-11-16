import { describe, it, expect, vi } from "vitest";
import { replyWithPhotoMarkdownV2Safe } from "../src/bot/telegram.js";

describe("replyWithPhotoMarkdownV2Safe", () => {
  it("truncates caption before sending", async () => {
    const captured: any = {};
    const ctx: any = {
      replyWithPhoto: async (source: any, extra: any) => {
        captured.extra = extra;
        return true;
      },
    };

    const veryLong = "x".repeat(5000);
    await replyWithPhotoMarkdownV2Safe(ctx, () => ({ source: "a" }), {
      caption: veryLong as any,
      parse_mode: "MarkdownV2",
    } as any);

    expect(captured.extra).toBeDefined();
    expect(captured.extra.caption.length).toBeLessThanOrEqual(4096);
  });
});
