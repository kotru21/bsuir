import type { RecommendationContext } from "../../../session.js";
import { ensureProfile, ensureTemp } from "../../../session.js";
import { contactKeyboard } from "../../../keyboards.js";
import {
  sendGoalPriorityPrompt,
  sendPromptMessage,
  sendTransientMessage,
} from "../prompts.js";
import type { GoalPriorityMap, GoalTag } from "../../../../types.js";

const MAX_PRIORITIES = 2;

function buildPriorityMap(
  selection: GoalTag[],
  prioritized: GoalTag[]
): GoalPriorityMap {
  if (!selection.length) {
    return {};
  }
  const map: GoalPriorityMap = {};
  selection.forEach((tag) => {
    map[tag] = prioritized.includes(tag) ? 1 : 0.5;
  });
  return map;
}

export async function goalPriorityStep(
  ctx: RecommendationContext
): Promise<void> {
  const profile = ensureProfile(ctx);
  const selection = profile.desiredGoals ?? [];
  if (!selection.length) {
    await ctx.reply(
      "Цели не найдены. Вернитесь назад и отметьте хотя бы одну цель."
    );
    await ctx.scene.leave();
    return;
  }

  if (ctx.updateType !== "callback_query") {
    if (ctx.message && "text" in ctx.message) {
      await sendTransientMessage(
        ctx,
        "Нажмите на цели ниже, чтобы отметить главные приоритеты."
      );
    }
    return;
  }

  const callback = ctx.callbackQuery;
  const data = callback && "data" in callback ? callback.data ?? "" : "";
  if (!data.startsWith("goalpr:")) {
    await ctx.answerCbQuery?.();
    return;
  }

  const temp = ensureTemp(ctx);
  if (!temp.goalPrioritySelection) {
    temp.goalPrioritySelection = selection.slice(0, MAX_PRIORITIES);
  }

  const action = data.split(":")[1];

  if (action === "clear") {
    temp.goalPrioritySelection = [];
    await ctx.answerCbQuery?.("Приоритеты очищены.");
    await sendGoalPriorityPrompt(ctx, "edit");
    return;
  }

  if (action === "skip") {
    profile.goalPriorities = buildPriorityMap(selection, []);
    temp.goalPrioritySelection = undefined;
    await ctx.answerCbQuery?.("Пропущено — все цели получат равный вес.");
    if (callback && "message" in callback && callback.message) {
      await ctx
        .deleteMessage(callback.message.message_id)
        .catch(() => undefined);
    }
    await sendPromptMessage(
      ctx,
      "Следует ли избегать контактных видов спорта?",
      contactKeyboard
    );
    await ctx.wizard.next();
    return;
  }

  if (action === "done") {
    const prioritized = temp.goalPrioritySelection ?? [];
    profile.goalPriorities = buildPriorityMap(selection, prioritized);
    temp.goalPrioritySelection = undefined;
    await ctx.answerCbQuery?.("Приоритеты сохранены.");
    if (callback && "message" in callback && callback.message) {
      await ctx
        .deleteMessage(callback.message.message_id)
        .catch(() => undefined);
    }
    await sendPromptMessage(
      ctx,
      "Следует ли избегать контактных видов спорта?",
      contactKeyboard
    );
    await ctx.wizard.next();
    return;
  }

  const tag = action as GoalTag;
  if (!selection.includes(tag)) {
    await ctx.answerCbQuery?.();
    return;
  }

  const prioritized = temp.goalPrioritySelection ?? [];
  if (prioritized.includes(tag)) {
    temp.goalPrioritySelection = prioritized.filter((item) => item !== tag);
    await ctx.answerCbQuery?.("Цель убрана из приоритетов.");
    await sendGoalPriorityPrompt(ctx, "edit");
    return;
  }

  if (prioritized.length >= MAX_PRIORITIES) {
    await ctx.answerCbQuery?.(
      `Можно выбрать максимум ${MAX_PRIORITIES} приоритетных целей.`,
      { show_alert: true }
    );
    return;
  }

  temp.goalPrioritySelection = [...prioritized, tag];
  await ctx.answerCbQuery?.("Цель добавлена в приоритеты.");
  await sendGoalPriorityPrompt(ctx, "edit");
}
