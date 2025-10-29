/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { introStep } from "../src/bot/scenes/onboarding/steps/introStep.js";
import { ageSelectionStep } from "../src/bot/scenes/onboarding/steps/ageSelectionStep.js";
import { RecommendationContext } from "../src/bot/session.js";

function makeMockCtx(): any {
  const partial: any = {
    session: {},
    reply: vi.fn().mockResolvedValue({ message_id: 1, chat: { id: 123 } }),
    editMessageText: vi.fn().mockResolvedValue(undefined),
    answerCbQuery: vi.fn().mockResolvedValue(undefined),
    deleteMessage: vi.fn().mockResolvedValue(undefined),
    telegram: { deleteMessage: vi.fn().mockResolvedValue(undefined) },
    scene: { leave: vi.fn().mockResolvedValue(undefined) },
    wizard: { next: vi.fn().mockResolvedValue(undefined) },
    callbackQuery: undefined,
    updateType: "message",
  };
  return partial;
}

describe("onboarding context handlers (mocked)", () => {
  it("introStep initializes session and sends slider", async () => {
    const ctx = makeMockCtx();
    await introStep(ctx as RecommendationContext);
    expect(ctx.session.profile).toBeDefined();
    expect(ctx.reply).toHaveBeenCalledWith(
      "Здравствуйте! Я помогу подобрать подходящую спортивную секцию БГУИР."
    );
  });

  it("ageSelectionStep handles age:done and commits age", async () => {
    const ctx = makeMockCtx();
    await introStep(ctx as RecommendationContext);
    ctx.updateType = "callback_query";
    ctx.callbackQuery = {
      data: "age:done",
      message: { message_id: 2, chat: { id: 123 } },
    };
    ctx.session.temp = { ageValue: 25 };
    await ageSelectionStep(ctx as RecommendationContext);
    expect(ctx.session.profile?.age).toBe(25);
    expect(ctx.answerCbQuery).toHaveBeenCalled();
  });
});
