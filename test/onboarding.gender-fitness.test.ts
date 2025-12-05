/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "bun:test";
import { sportSections } from "../prisma/data/sections.js";

vi.mock("../src/infrastructure/prismaClient.js", () => ({
  getPrismaClient: () => ({
    sportSection: {
      findMany: vi.fn().mockResolvedValue(sportSections),
    },
  }),
}));

vi.mock("../src/services/submissionRecorder.js", () => ({
  recordSubmission: vi.fn().mockResolvedValue(undefined),
}));

import { genderStep } from "../src/bot/scenes/onboarding/steps/genderStep.js";
import { fitnessStep } from "../src/bot/scenes/onboarding/steps/fitnessStep.js";
import type { RecommendationContext } from "../src/bot/session.js";

function createCallbackCtx(data: string): RecommendationContext & any {
  const ctx: any = {
    updateType: "callback_query",
    callbackQuery: { data, message: { message_id: 100, chat: { id: 1 } } },
    session: {},
    message: undefined,
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

function createTextCtx(): RecommendationContext & any {
  const ctx: any = {
    updateType: "message",
    callbackQuery: undefined,
    message: { text: "random text", message_id: 99, chat: { id: 1 } },
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

describe("genderStep", () => {
  it("ignores text messages and sends transient prompt", async () => {
    const ctx = createTextCtx();
    await genderStep(ctx);
    expect(ctx.reply).toHaveBeenCalled();
    const callArg = ctx.reply.mock.calls[0][0];
    expect(callArg).toContain("выберите вариант");
  });

  it("sets gender to male", async () => {
    const ctx = createCallbackCtx("gender:male");
    await genderStep(ctx);
    expect(ctx.session.profile?.gender).toBe("male");
    expect(ctx.wizard.next).toHaveBeenCalled();
  });

  it("sets gender to female", async () => {
    const ctx = createCallbackCtx("gender:female");
    await genderStep(ctx);
    expect(ctx.session.profile?.gender).toBe("female");
  });

  it("sets gender to unspecified for unknown value", async () => {
    const ctx = createCallbackCtx("gender:other");
    await genderStep(ctx);
    expect(ctx.session.profile?.gender).toBe("unspecified");
  });

  it("ignores unrelated callback data", async () => {
    const ctx = createCallbackCtx("unrelated:data");
    await genderStep(ctx);
    expect(ctx.answerCbQuery).toHaveBeenCalled();
    expect(ctx.wizard.next).not.toHaveBeenCalled();
  });
});

describe("fitnessStep", () => {
  it("ignores text messages", async () => {
    const ctx = createTextCtx();
    await fitnessStep(ctx);
    expect(ctx.reply).toHaveBeenCalled();
    const callArg = ctx.reply.mock.calls[0][0];
    expect(callArg).toContain("Используйте кнопки");
  });

  it("decrements fitness index on fitness_prev", async () => {
    const ctx = createCallbackCtx("fitness_prev");
    ctx.session.temp = { fitnessIndex: 2 };
    await fitnessStep(ctx);
    expect(ctx.session.temp.fitnessIndex).toBe(1);
  });

  it("does not go below 0 on fitness_prev", async () => {
    const ctx = createCallbackCtx("fitness_prev");
    ctx.session.temp = { fitnessIndex: 0 };
    await fitnessStep(ctx);
    expect(ctx.session.temp.fitnessIndex).toBe(0);
  });

  it("increments fitness index on fitness_next", async () => {
    const ctx = createCallbackCtx("fitness_next");
    ctx.session.temp = { fitnessIndex: 1 };
    await fitnessStep(ctx);
    expect(ctx.session.temp.fitnessIndex).toBe(2);
  });

  it("does not exceed max on fitness_next", async () => {
    const ctx = createCallbackCtx("fitness_next");
    ctx.session.temp = { fitnessIndex: 2 }; // max is 2 (3 levels: low, medium, high)
    await fitnessStep(ctx);
    expect(ctx.session.temp.fitnessIndex).toBe(2);
  });

  it("answers with current label on fitness_label", async () => {
    const ctx = createCallbackCtx("fitness_label");
    ctx.session.temp = { fitnessIndex: 2 };
    await fitnessStep(ctx);
    expect(ctx.answerCbQuery).toHaveBeenCalledWith(
      expect.stringContaining("Текущий выбор")
    );
  });

  it("saves fitness level on fitness_done and advances", async () => {
    const ctx = createCallbackCtx("fitness_done");
    ctx.session.temp = { fitnessIndex: 2 };
    await fitnessStep(ctx);
    expect(ctx.session.profile?.fitnessLevel).toBeDefined();
    expect(ctx.wizard.next).toHaveBeenCalled();
  });

  it("ignores unknown callback data", async () => {
    const ctx = createCallbackCtx("unknown:data");
    ctx.session.temp = { fitnessIndex: 1 };
    await fitnessStep(ctx);
    expect(ctx.answerCbQuery).toHaveBeenCalled();
    expect(ctx.wizard.next).not.toHaveBeenCalled();
  });
});
