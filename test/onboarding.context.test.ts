/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import {
  ageStepHandler,
  genderStepHandler,
} from "../src/bot/scenes/onboarding.js";

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
  it("ageStepHandler initializes session and sends slider on /start", async () => {
    const ctx = makeMockCtx();
    await ageStepHandler(ctx);
    expect(ctx.session).toBeDefined();
    expect(ctx.reply).toHaveBeenCalled();
  });

  it("genderStepHandler handles age callback done and sets profile.age", async () => {
    const ctx = makeMockCtx();
    // simulate callback_query with data age:done
    ctx.updateType = "callback_query";
    ctx.callbackQuery = { data: "age:done", message: { message_id: 2 } };
    ctx.session.temp = {};
    await ageStepHandler(ctx); // initialize
    // set temp ageValue to 25 before calling gender handler
    ctx.session.temp.ageValue = 25;
    await genderStepHandler(ctx);
    // after done, profile.age should be set
    expect(ctx.session.profile?.age).toBe(25);
    expect(ctx.answerCbQuery).toHaveBeenCalled();
  });
});
