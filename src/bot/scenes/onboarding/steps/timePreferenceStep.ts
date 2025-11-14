import type { RecommendationContext } from "../../../session.js";
import { ensureProfile, ensureTemp } from "../../../session.js";
import { sendPromptMessage, sendTransientMessage } from "../prompts.js";
import { sendGoalPrompt } from "../prompts.js";
import { buildTimePreferenceKeyboard } from "../../../keyboards.js";
import { timeSelectionText } from "../../../formatters.js";

export async function timePreferenceStep(
  ctx: RecommendationContext
): Promise<void> {
  if (ctx.updateType !== "callback_query") {
    if (ctx.message && "text" in ctx.message) {
      await sendTransientMessage(ctx, "Выберите удобное время тренировки.");
    }
    return;
  }

  const callback = ctx.callbackQuery;
  const data = callback && "data" in callback ? callback.data : undefined;
  if (!data || !data.startsWith("time:")) {
    await ctx.answerCbQuery?.();
    return;
  }

  const temp = ensureTemp(ctx);
  if (!temp.timeSelection) temp.timeSelection = [];

  const action = data.split(":")[1];
  if (action === "done") {
    ensureProfile(ctx).preferredTimes = temp.timeSelection;
    await ctx.answerCbQuery?.("Время сохранено.");
    if (callback && "message" in callback && callback.message) {
      await ctx
        .deleteMessage(callback.message.message_id)
        .catch(() => undefined);
    }
    try {
      await sendGoalPrompt(ctx, "new");
    } catch (err) {
      console.error("sendGoalPrompt failed, falling back to reply:", err);
      // fallback: send a simple reply with the goal keyboard
      const { buildGoalKeyboard } = await import("../../../keyboards.js");
      const { goalSelectionText } = await import("../../../formatters.js");
      const sel = temp.goalSelection ?? [];
      await ctx.reply(goalSelectionText(sel), buildGoalKeyboard(sel));
    }
    await ctx.wizard.next();
    return;
  }

  const timeOpt = action as "morning" | "afternoon" | "evening" | "weekend";
  if (temp.timeSelection.includes(timeOpt)) {
    temp.timeSelection = temp.timeSelection.filter((t) => t !== timeOpt);
    await ctx.answerCbQuery?.("Опция снята.");
  } else {
    temp.timeSelection.push(timeOpt);
    await ctx.answerCbQuery?.("Опция добавлена.");
  }

  const text = timeSelectionText(temp.timeSelection);
  await sendPromptMessage(
    ctx,
    text,
    buildTimePreferenceKeyboard(temp.timeSelection)
  );
}
