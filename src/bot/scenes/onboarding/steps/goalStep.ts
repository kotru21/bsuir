import type { RecommendationContext } from "../../../session.js";
import type { GoalTag } from "../../../../types.js";
import { ensureProfile, ensureTemp } from "../../../session.js";
import { goalOptions } from "../../../constants.js";
import {
  sendGoalPrompt,
  sendGoalPriorityPrompt,
  sendTransientMessage,
} from "../prompts.js";

export async function goalStep(ctx: RecommendationContext): Promise<void> {
  if (ctx.updateType !== "callback_query") {
    if (ctx.message && "text" in ctx.message) {
      await sendTransientMessage(ctx, "Используйте кнопки для отметки целей.");
    }
    return;
  }

  const callback = ctx.callbackQuery;
  const data = callback && "data" in callback ? callback.data : undefined;
  if (!data || !data.startsWith("goal:")) {
    await ctx.answerCbQuery?.();
    return;
  }

  const temp = ensureTemp(ctx);
  if (!temp.goalSelection) {
    temp.goalSelection = [];
  }

  const action = data.split(":")[1];
  if (action === "done") {
    if (!temp.goalSelection.length) {
      await ctx.answerCbQuery?.("Выберите хотя бы одну цель.", {
        show_alert: true,
      });
      return;
    }
    ensureProfile(ctx).desiredGoals = temp.goalSelection;
    await ctx.answerCbQuery?.("Цели сохранены.");
    if (callback && "message" in callback && callback.message) {
      await ctx
        .deleteMessage(callback.message.message_id)
        .catch(() => undefined);
    }
    await sendGoalPriorityPrompt(ctx, "new");
    await ctx.wizard.next();
    return;
  }

  if (action === "clear") {
    temp.goalSelection = [];
    await ctx.answerCbQuery?.("Выбор очищен.");
    await sendGoalPrompt(ctx, "edit");
    return;
  }

  let tag: GoalTag | undefined;
  if (action in goalOptions) {
    const entry = (
      Object.entries(goalOptions) as [string, { tag: GoalTag; label: string }][]
    ).find(([key]) => key === action);
    tag = entry ? entry[1].tag : undefined;
  } else {
    tag = action as GoalTag;
  }

  if (!tag) {
    await ctx.answerCbQuery?.();
    return;
  }

  if (temp.goalSelection.includes(tag)) {
    temp.goalSelection = temp.goalSelection.filter((item) => item !== tag);
    await ctx.answerCbQuery?.("Цель снята.");
  } else {
    temp.goalSelection.push(tag);
    await ctx.answerCbQuery?.("Цель добавлена.");
  }

  await sendGoalPrompt(ctx, "edit");
}
