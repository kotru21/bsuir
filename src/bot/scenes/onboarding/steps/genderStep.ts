import type { RecommendationContext } from "../../../session.js";
import { ensureProfile } from "../../../session.js";
import { sendFitnessSlider, sendTransientMessage } from "../prompts.js";
import { resetPromptState } from "../helpers.js";

export async function genderStep(ctx: RecommendationContext): Promise<void> {
  if (ctx.updateType !== "callback_query") {
    if (ctx.message && "text" in ctx.message) {
      await sendTransientMessage(
        ctx,
        "Пожалуйста, выберите вариант с помощью кнопок ниже."
      );
    }
    return;
  }

  const callback = ctx.callbackQuery;
  const data = callback && "data" in callback ? callback.data : undefined;
  if (!data || !data.startsWith("gender:")) {
    await ctx.answerCbQuery?.();
    return;
  }

  const value = data.split(":")[1];
  const profile = ensureProfile(ctx);
  if (value === "male") {
    profile.gender = "male";
  } else if (value === "female") {
    profile.gender = "female";
  } else {
    profile.gender = "unspecified";
  }

  const label =
    value === "male"
      ? "Мужской"
      : value === "female"
      ? "Женский"
      : "Без указания";
  await ctx.answerCbQuery?.(`Выбрано: ${label}`);

  if (callback && "message" in callback && callback.message) {
    await ctx.deleteMessage(callback.message.message_id).catch(() => undefined);
  }

  resetPromptState(ctx);
  await sendFitnessSlider(ctx, "new");
  await ctx.wizard.next();
}
