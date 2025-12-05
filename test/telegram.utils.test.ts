/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "bun:test";
import { TelegramError } from "telegraf";
import {
  stripMarkdownEscapes,
  replyMarkdownV2Safe,
  replyWithPhotoMarkdownV2Safe,
} from "../src/bot/telegram.js";
import type { RecommendationContext } from "../src/bot/session.js";

function createMockContext(): RecommendationContext & any {
  return {
    replyWithMarkdownV2: vi.fn().mockResolvedValue({ message_id: 1 }),
    reply: vi.fn().mockResolvedValue({ message_id: 1 }),
    replyWithPhoto: vi.fn().mockResolvedValue({ message_id: 1 }),
  };
}

describe("telegram utilities", () => {
  describe("stripMarkdownEscapes", () => {
    it("removes backslash escapes from markdown text", () => {
      const input = "Hello \\*world\\* \\_test\\_";
      const result = stripMarkdownEscapes(input);
      expect(result).toBe("Hello *world* _test_");
    });

    it("handles multiple escape sequences", () => {
      const input = "\\[link\\] \\(text\\) \\~strikethrough\\~";
      const result = stripMarkdownEscapes(input);
      expect(result).toBe("[link] (text) ~strikethrough~");
    });

    it("returns unchanged text without escapes", () => {
      const input = "plain text";
      expect(stripMarkdownEscapes(input)).toBe("plain text");
    });
  });

  describe("replyMarkdownV2Safe", () => {
    it("sends markdown message successfully", async () => {
      const ctx = createMockContext();
      await replyMarkdownV2Safe(ctx, "Hello *world*");

      expect(ctx.replyWithMarkdownV2).toHaveBeenCalledWith(
        "Hello *world*",
        undefined
      );
    });

    it("truncates long messages", async () => {
      const ctx = createMockContext();
      const longText = "a".repeat(5000);

      await replyMarkdownV2Safe(ctx, longText);

      const call = ctx.replyWithMarkdownV2.mock.calls[0][0];
      expect(call.length).toBeLessThanOrEqual(4096);
      expect(call.endsWith("…")).toBe(true);
    });

    it("falls back to plain text on markdown error", async () => {
      const ctx = createMockContext();
      const mdError = new TelegramError({
        error_code: 400,
        description: "Bad Request: can't parse entities",
      });
      ctx.replyWithMarkdownV2.mockRejectedValueOnce(mdError);

      await replyMarkdownV2Safe(ctx, "Test \\*message\\*");

      expect(ctx.reply).toHaveBeenCalledWith("Test *message*", undefined);
    });

    it("throws non-400 errors", async () => {
      const ctx = createMockContext();
      const networkError = new Error("Network error");
      ctx.replyWithMarkdownV2.mockRejectedValueOnce(networkError);

      await expect(replyMarkdownV2Safe(ctx, "test")).rejects.toThrow(
        "Network error"
      );
    });

    it("throws when fallback also fails", async () => {
      const ctx = createMockContext();
      const mdError = new TelegramError({
        error_code: 400,
        description: "Bad Request",
      });
      ctx.replyWithMarkdownV2.mockRejectedValueOnce(mdError);
      ctx.reply.mockRejectedValueOnce(new Error("Fallback failed"));

      await expect(replyMarkdownV2Safe(ctx, "test")).rejects.toThrow(
        "Fallback failed"
      );
    });

    it("removes parse_mode from extra on fallback", async () => {
      const ctx = createMockContext();
      const mdError = new TelegramError({
        error_code: 400,
        description: "Bad Request",
      });
      ctx.replyWithMarkdownV2.mockRejectedValueOnce(mdError);

      await replyMarkdownV2Safe(ctx, "test", {
        parse_mode: "MarkdownV2",
      } as any);

      expect(ctx.reply).toHaveBeenCalled();
      const fallbackExtra = ctx.reply.mock.calls[0][1];
      expect(fallbackExtra).not.toHaveProperty("parse_mode");
    });
  });

  describe("replyWithPhotoMarkdownV2Safe", () => {
    it("sends photo successfully", async () => {
      const ctx = createMockContext();
      const photoFactory = () => "photo-url";

      await replyWithPhotoMarkdownV2Safe(ctx, photoFactory, {
        caption: "Test caption",
      });

      expect(ctx.replyWithPhoto).toHaveBeenCalledWith("photo-url", {
        caption: "Test caption",
      });
    });

    it("truncates long captions", async () => {
      const ctx = createMockContext();
      const longCaption = "a".repeat(5000);

      await replyWithPhotoMarkdownV2Safe(ctx, () => "photo", {
        caption: longCaption,
      });

      const call = ctx.replyWithPhoto.mock.calls[0][1];
      expect(call.caption.length).toBeLessThanOrEqual(4096);
    });

    it("falls back to plain text caption on error", async () => {
      const ctx = createMockContext();
      const mdError = new TelegramError({
        error_code: 400,
        description: "Bad Request",
      });
      ctx.replyWithPhoto.mockRejectedValueOnce(mdError);

      await replyWithPhotoMarkdownV2Safe(ctx, () => "photo", {
        caption: "Test \\*caption\\*",
        parse_mode: "MarkdownV2",
      });

      expect(ctx.replyWithPhoto).toHaveBeenCalledTimes(2);
      const secondCall = ctx.replyWithPhoto.mock.calls[1][1];
      expect(secondCall.caption).toBe("Test *caption*");
      expect(secondCall).not.toHaveProperty("parse_mode");
    });

    it("throws when fallback photo also fails", async () => {
      const ctx = createMockContext();
      const mdError = new TelegramError({
        error_code: 400,
        description: "Bad Request",
      });
      ctx.replyWithPhoto
        .mockRejectedValueOnce(mdError)
        .mockRejectedValueOnce(new Error("Fallback failed"));

      await expect(
        replyWithPhotoMarkdownV2Safe(ctx, () => "photo", { caption: "test" })
      ).rejects.toThrow("Fallback failed");
    });

    it("throws non-400 errors", async () => {
      const ctx = createMockContext();
      ctx.replyWithPhoto.mockRejectedValueOnce(new Error("Network error"));

      await expect(
        replyWithPhotoMarkdownV2Safe(ctx, () => "photo")
      ).rejects.toThrow("Network error");
    });
  });
});
