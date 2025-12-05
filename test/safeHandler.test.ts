/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "bun:test";
import { wrapBotHandler, wrapSceneStep } from "../src/bot/utils/safeHandler.js";
import type { RecommendationContext } from "../src/bot/session.js";

function createMockContext(): RecommendationContext & any {
  return {
    callbackQuery: { data: "test" },
    answerCbQuery: vi.fn().mockResolvedValue(undefined),
    reply: vi.fn().mockResolvedValue({ message_id: 1, chat: { id: 1 } }),
    scene: { leave: vi.fn().mockResolvedValue(undefined) },
  };
}

describe("safeHandler utilities", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("wrapBotHandler", () => {
    it("executes handler successfully when no error", async () => {
      const handler = vi.fn().mockResolvedValue("ok");
      const wrapped = wrapBotHandler(handler, "Test handler");
      const ctx = createMockContext();

      await wrapped(ctx);

      expect(handler).toHaveBeenCalledWith(ctx);
    });

    it("catches errors and notifies user", async () => {
      const handler = vi.fn().mockRejectedValue(new Error("Test error"));
      const wrapped = wrapBotHandler(handler, "Test handler");
      const ctx = createMockContext();

      await wrapped(ctx);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(ctx.answerCbQuery).toHaveBeenCalledWith(
        expect.stringContaining("ошибка"),
        expect.any(Object)
      );
    });

    it("logs error message for non-Error thrown values", async () => {
      const handler = vi.fn().mockRejectedValue("string error");
      const wrapped = wrapBotHandler(handler, "Test handler");
      const ctx = createMockContext();

      await wrapped(ctx);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("handles when answerCbQuery fails", async () => {
      const handler = vi.fn().mockRejectedValue(new Error("Handler error"));
      const wrapped = wrapBotHandler(handler, "Test");
      const ctx = createMockContext();
      ctx.answerCbQuery = vi.fn().mockRejectedValue(new Error("CB error"));

      await wrapped(ctx);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(ctx.reply).toHaveBeenCalled();
    });

    it("handles when reply also fails", async () => {
      const handler = vi.fn().mockRejectedValue(new Error("Handler error"));
      const wrapped = wrapBotHandler(handler, "Test");
      const ctx = createMockContext();
      ctx.answerCbQuery = vi.fn().mockRejectedValue(new Error("CB error"));
      ctx.reply = vi.fn().mockRejectedValue(new Error("Reply error"));

      await wrapped(ctx);

      // Should not throw, just log errors
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("wrapSceneStep", () => {
    it("executes step successfully", async () => {
      const step = vi.fn().mockResolvedValue(undefined);
      const wrapped = wrapSceneStep(step, "Test step");
      const ctx = createMockContext();

      await wrapped(ctx);

      expect(step).toHaveBeenCalledWith(ctx);
    });

    it("leaves scene on error", async () => {
      const step = vi.fn().mockRejectedValue(new Error("Step error"));
      const wrapped = wrapSceneStep(step, "Test step");
      const ctx = createMockContext();

      await wrapped(ctx);

      expect(ctx.scene.leave).toHaveBeenCalled();
    });

    it("handles scene.leave failure gracefully", async () => {
      const step = vi.fn().mockRejectedValue(new Error("Step error"));
      const wrapped = wrapSceneStep(step, "Test step");
      const ctx = createMockContext();
      ctx.scene.leave = vi.fn().mockRejectedValue(new Error("Leave error"));

      await wrapped(ctx);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
