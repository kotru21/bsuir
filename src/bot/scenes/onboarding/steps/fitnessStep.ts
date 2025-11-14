import type { RecommendationContext } from "../../../session.js";
import { ensureProfile, ensureTemp } from "../../../session.js";
import {
  sendFitnessSlider,
  sendIntensityComfortPrompt,
  sendTransientMessage,
} from "../prompts.js";
import { resetPromptState } from "../helpers.js";
import { fitnessOrder } from "../../../constants.js";
import { currentFitnessLabel } from "../prompts.js";

export async function fitnessStep(ctx: RecommendationContext): Promise<void> {
  if (ctx.updateType !== "callback_query") {
    if (ctx.message && "text" in ctx.message) {
      await sendTransientMessage(
        ctx,
        "Используйте кнопки ниже, чтобы настроить уровень."
      );
    }
    return;
  }

  const callback = ctx.callbackQuery;
  const data = callback && "data" in callback ? callback.data : undefined;
  const temp = ensureTemp(ctx);
  if (temp.fitnessIndex === undefined) {
    temp.fitnessIndex = 1;
  }

  if (!data) {
    await ctx.answerCbQuery?.();
    return;
  }

  if (data === "fitness_prev") {
    temp.fitnessIndex = Math.max(0, temp.fitnessIndex - 1);
    await ctx.answerCbQuery?.();
    await sendFitnessSlider(ctx, "edit");
    return;
  }

  if (data === "fitness_next") {
    temp.fitnessIndex = Math.min(
      fitnessOrder.length - 1,
      temp.fitnessIndex + 1
    );
    await ctx.answerCbQuery?.();
    await sendFitnessSlider(ctx, "edit");
    return;
  }

  if (data === "fitness_label") {
    await ctx.answerCbQuery?.(
      `Текущий выбор: ${currentFitnessLabel(temp.fitnessIndex)}`
    );
    return;
  }

  if (data === "fitness_done") {
    const profile = ensureProfile(ctx);
    const level = fitnessOrder[temp.fitnessIndex] ?? "medium";
    profile.fitnessLevel = level;
    await ctx.answerCbQuery?.("Уровень сохранен.");
    if (callback && "message" in callback && callback.message) {
      await ctx
        .deleteMessage(callback.message.message_id)
        .catch(() => undefined);
    }
    resetPromptState(ctx);
    await sendIntensityComfortPrompt(ctx, "new");
    await ctx.wizard.next();
    return;
  }

  await ctx.answerCbQuery?.();
}
