/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "bun:test";
import { TelegramError } from "telegraf";
import {
  cleanupPromptMessage,
  sendPromptMessage,
  sendTransientMessage,
  sendAgeSlider,
  sendFitnessSlider,
  sendFormatPrompt,
  sendGoalPrompt,
  sendGoalPriorityPrompt,
  sendIntensityComfortPrompt,
  currentFitnessLabel,
} from "../src/bot/scenes/onboarding/prompts.js";
import type { RecommendationContext } from "../src/bot/session.js";

function createMockContext(): RecommendationContext & any {
  return {
    session: {},
    reply: vi.fn().mockResolvedValue({ message_id: 1, chat: { id: 123 } }),
    editMessageText: vi.fn().mockResolvedValue(undefined),
    telegram: {
      deleteMessage: vi.fn().mockResolvedValue(undefined),
    },
    callbackQuery: { message: { message_id: 100, chat: { id: 123 } } },
  };
}

describe("prompts", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("cleanupPromptMessage", () => {
    it("does nothing when no promptMessageId", async () => {
      const ctx = createMockContext();
      ctx.session.temp = {};

      await cleanupPromptMessage(ctx);

      expect(ctx.telegram.deleteMessage).not.toHaveBeenCalled();
    });

    it("deletes prompt message and clears state", async () => {
      const ctx = createMockContext();
      ctx.session.temp = { promptMessageId: 50, promptChatId: 123 };

      await cleanupPromptMessage(ctx);

      expect(ctx.telegram.deleteMessage).toHaveBeenCalledWith(123, 50);
      expect(ctx.session.temp.promptMessageId).toBeUndefined();
      expect(ctx.session.temp.promptChatId).toBeUndefined();
    });

    it("ignores 'message to delete not found' error", async () => {
      const ctx = createMockContext();
      ctx.session.temp = { promptMessageId: 50, promptChatId: 123 };
      const err = new TelegramError({
        error_code: 400,
        description: "Bad Request: message to delete not found",
      });
      ctx.telegram.deleteMessage.mockRejectedValueOnce(err);

      await cleanupPromptMessage(ctx);

      // Should not log error for this specific case
      expect(ctx.session.temp.promptMessageId).toBeUndefined();
    });

    it("logs other errors", async () => {
      const ctx = createMockContext();
      ctx.session.temp = { promptMessageId: 50, promptChatId: 123 };
      ctx.telegram.deleteMessage.mockRejectedValueOnce(
        new Error("Other error")
      );

      await cleanupPromptMessage(ctx);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("sendPromptMessage", () => {
    it("sends message and stores message id", async () => {
      const ctx = createMockContext();
      ctx.session.temp = {};

      await sendPromptMessage(ctx, "Test message", {
        parse_mode: "HTML",
      } as any);

      expect(ctx.reply).toHaveBeenCalledWith("Test message", {
        parse_mode: "HTML",
      });
      expect(ctx.session.temp.promptMessageId).toBe(1);
      expect(ctx.session.temp.promptChatId).toBe(123);
    });
  });

  describe("sendTransientMessage", () => {
    it("sends message and schedules deletion", async () => {
      const ctx = createMockContext();

      await sendTransientMessage(ctx, "Transient");

      expect(ctx.reply).toHaveBeenCalledWith("Transient");
      // Just verify reply was called - we can't easily test setTimeout in Bun
    });
  });

  describe("sendAgeSlider", () => {
    it("sends new age slider", async () => {
      const ctx = createMockContext();
      ctx.session.temp = {};

      await sendAgeSlider(ctx, "new");

      expect(ctx.reply).toHaveBeenCalled();
      expect(ctx.session.temp.ageValue).toBeDefined();
    });

    it("edits existing message in edit mode", async () => {
      const ctx = createMockContext();
      ctx.session.temp = { ageValue: 25 };

      await sendAgeSlider(ctx, "edit");

      expect(ctx.editMessageText).toHaveBeenCalled();
    });

    it("handles error gracefully", async () => {
      const ctx = createMockContext();
      ctx.session.temp = {};
      ctx.reply.mockRejectedValueOnce(new Error("Send failed"));

      await sendAgeSlider(ctx, "new");

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("sendFitnessSlider", () => {
    it("sends new fitness slider", async () => {
      const ctx = createMockContext();
      ctx.session = { temp: {}, profile: { fitnessLevel: "medium" } };

      await sendFitnessSlider(ctx, "new");

      expect(ctx.reply).toHaveBeenCalled();
    });

    it("edits in edit mode", async () => {
      const ctx = createMockContext();
      ctx.session = { temp: { fitnessIndex: 2 }, profile: {} };

      await sendFitnessSlider(ctx, "edit");

      expect(ctx.editMessageText).toHaveBeenCalled();
    });

    it("handles error", async () => {
      const ctx = createMockContext();
      ctx.session = { temp: {}, profile: {} };
      ctx.reply.mockRejectedValueOnce(new Error("Error"));

      await sendFitnessSlider(ctx, "new");

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("sendFormatPrompt", () => {
    it("sends format selection prompt", async () => {
      const ctx = createMockContext();
      ctx.session = { temp: {}, profile: { preferredFormats: ["group"] } };

      await sendFormatPrompt(ctx, "new");

      expect(ctx.reply).toHaveBeenCalled();
    });

    it("handles error", async () => {
      const ctx = createMockContext();
      ctx.session = { temp: {}, profile: {} };
      ctx.reply.mockRejectedValueOnce(new Error("Error"));

      await sendFormatPrompt(ctx, "new");

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("sendGoalPrompt", () => {
    it("sends goal selection prompt", async () => {
      const ctx = createMockContext();
      ctx.session = { temp: {}, profile: { desiredGoals: ["strength"] } };

      await sendGoalPrompt(ctx, "new");

      expect(ctx.reply).toHaveBeenCalled();
    });

    it("handles error", async () => {
      const ctx = createMockContext();
      ctx.session = { temp: {}, profile: {} };
      ctx.reply.mockRejectedValueOnce(new Error("Error"));

      await sendGoalPrompt(ctx, "new");

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("sendGoalPriorityPrompt", () => {
    it("sends goal priority prompt", async () => {
      const ctx = createMockContext();
      ctx.session = {
        temp: {},
        profile: { desiredGoals: ["strength", "endurance"] },
      };

      await sendGoalPriorityPrompt(ctx, "new");

      expect(ctx.reply).toHaveBeenCalled();
    });

    it("handles empty goals", async () => {
      const ctx = createMockContext();
      ctx.session = {
        temp: { goalSelection: [] },
        profile: { desiredGoals: [] },
      };

      await sendGoalPriorityPrompt(ctx, "new");

      expect(ctx.reply).toHaveBeenCalled();
    });

    it("handles error", async () => {
      const ctx = createMockContext();
      ctx.session = { temp: {}, profile: {} };
      ctx.reply.mockRejectedValueOnce(new Error("Error"));

      await sendGoalPriorityPrompt(ctx, "new");

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("sendIntensityComfortPrompt", () => {
    it("sends intensity comfort prompt", async () => {
      const ctx = createMockContext();
      ctx.session = { temp: {}, profile: {} };

      await sendIntensityComfortPrompt(ctx, "new");

      expect(ctx.reply).toHaveBeenCalled();
    });

    it("edits in edit mode", async () => {
      const ctx = createMockContext();
      ctx.session = { temp: {}, profile: {} };

      await sendIntensityComfortPrompt(ctx, "edit");

      expect(ctx.editMessageText).toHaveBeenCalled();
    });

    it("handles error", async () => {
      const ctx = createMockContext();
      ctx.session = { temp: {}, profile: {} };
      ctx.reply.mockRejectedValueOnce(new Error("Error"));

      await sendIntensityComfortPrompt(ctx, "new");

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("currentFitnessLabel", () => {
    it("returns label for valid index", () => {
      const label = currentFitnessLabel(2);
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    });

    it("returns default for invalid index", () => {
      const label = currentFitnessLabel(100);
      expect(typeof label).toBe("string");
    });
  });
});
