/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { formatStep } from "../src/bot/scenes/onboarding/steps/formatStep.js";
import { goalStep } from "../src/bot/scenes/onboarding/steps/goalStep.js";
import { contactPreferenceStep } from "../src/bot/scenes/onboarding/steps/contactPreferenceStep.js";
import { competitionInterestStep } from "../src/bot/scenes/onboarding/steps/competitionInterestStep.js";
import type { RecommendationContext } from "../src/bot/session.js";

function createCallbackCtx(data: string): RecommendationContext & any {
  const ctx: any = {
    updateType: "callback_query",
    callbackQuery: { data, message: { message_id: 100, chat: { id: 1 } } },
    session: {},
    reply: vi.fn().mockResolvedValue({ message_id: 1, chat: { id: 1 } }),
    replyWithMarkdownV2: vi
      .fn()
      .mockResolvedValue({ message_id: 1, chat: { id: 1 } }),
    replyWithPhoto: vi
      .fn()
      .mockResolvedValue({ message_id: 1, chat: { id: 1 } }),
    editMessageText: vi.fn().mockResolvedValue(undefined),
    answerCbQuery: vi.fn().mockResolvedValue(undefined),
    deleteMessage: vi.fn().mockResolvedValue(undefined),
    telegram: { deleteMessage: vi.fn().mockResolvedValue(undefined) },
    wizard: { next: vi.fn().mockResolvedValue(undefined) },
    scene: { leave: vi.fn().mockResolvedValue(undefined) },
  };
  return ctx;
}

describe("onboarding step workflows", () => {
  it("formatStep toggles selections and persists on done", async () => {
    const ctx = createCallbackCtx("format:individual");
    await formatStep(ctx);
    expect(ctx.session.temp.formatSelection).toContain("individual");

    ctx.callbackQuery.data = "format:done";
    await formatStep(ctx);
    expect(ctx.session.profile?.preferredFormats).toContain("individual");
    expect(ctx.wizard.next).toHaveBeenCalled();
  });

  it("timePreferenceStep toggles times and persists selection", async () => {
    const { timePreferenceStep } = await import(
      "../src/bot/scenes/onboarding/steps/timePreferenceStep.js"
    );
    const ctx = createCallbackCtx("time:morning");
    await timePreferenceStep(ctx);
    expect(ctx.session.temp.timeSelection).toContain("morning");

    ctx.callbackQuery.data = "time:done";
    await timePreferenceStep(ctx);
    expect(ctx.session.profile?.preferredTimes).toContain("morning");
    expect(ctx.wizard.next).toHaveBeenCalled();
  });

  it("goalStep prevents completion without selections", async () => {
    const ctx = createCallbackCtx("goal:done");
    await goalStep(ctx);
    expect(ctx.answerCbQuery).toHaveBeenCalledWith(
      "Выберите хотя бы одну цель.",
      { show_alert: true }
    );
  });

  it("goalStep stores selections and advances", async () => {
    const ctx = createCallbackCtx("goal:strength");
    await goalStep(ctx);
    ctx.callbackQuery.data = "goal:done";
    await goalStep(ctx);
    expect(ctx.session.profile?.desiredGoals).toContain("strength");
  });

  it("contactPreferenceStep stores avoidContact flag", async () => {
    const ctx = createCallbackCtx("contact:yes");
    await contactPreferenceStep(ctx);
    expect(ctx.session.profile?.avoidContact).toBe(true);
    expect(ctx.wizard.next).toHaveBeenCalled();
  });

  it("competitionInterestStep computes recommendations", async () => {
    const ctx = createCallbackCtx("competition:yes");
    ctx.session.temp = {
      recommendations: [],
    };
    ctx.session.profile = {
      age: 20,
      gender: "unspecified",
      fitnessLevel: "medium",
      preferredFormats: [],
      desiredGoals: ["competition"],
      avoidContact: false,
      interestedInCompetition: true,
    };
    await competitionInterestStep(ctx);
    expect(Array.isArray(ctx.session.temp?.recommendations)).toBe(true);
  });
});
