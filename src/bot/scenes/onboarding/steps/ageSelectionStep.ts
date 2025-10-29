import { clampAge, parseAgeDelta, resetPromptState } from "../helpers.js";
import type { RecommendationContext } from "../../../session.js";
import {
  sendAgeSlider,
  sendPromptMessage,
  sendTransientMessage,
} from "../prompts.js";
import { ensureProfile, ensureTemp } from "../../../session.js";
import { AGE_DEFAULT } from "../../../constants.js";
import { genderKeyboard } from "../../../keyboards.js";

export async function ageSelectionStep(
  ctx: RecommendationContext
): Promise<void> {
  if (ctx.updateType !== "callback_query") {
    if (ctx.message && "text" in ctx.message) {
      await sendTransientMessage(
        ctx,
        "Пожалуйста, используйте кнопки ниже для выбора возраста."
      );
    }
    return;
  }

  const callback = ctx.callbackQuery;
  const data = callback && "data" in callback ? callback.data : undefined;
  if (!data || !data.startsWith("age:")) {
    await ctx.answerCbQuery?.();
    return;
  }

  const action = data.split(":")[1];
  const temp = ensureTemp(ctx);
  if (temp.ageValue === undefined) {
    temp.ageValue = AGE_DEFAULT;
  }

  if (action === "done") {
    const age = clampAge(temp.ageValue);
    ensureProfile(ctx).age = age;
    await ctx.answerCbQuery?.(`Возраст сохранен: ${age} лет`);
    if (callback && "message" in callback && callback.message) {
      await ctx
        .deleteMessage(callback.message.message_id)
        .catch(() => undefined);
    }
    resetPromptState(ctx);
    await sendPromptMessage(ctx, "Укажите пол:", genderKeyboard);
    await ctx.wizard.next();
    return;
  }

  const delta = parseAgeDelta(action);
  if (delta === null) {
    await ctx.answerCbQuery?.();
    return;
  }

  temp.ageValue = clampAge((temp.ageValue ?? AGE_DEFAULT) + delta);
  await ctx.answerCbQuery?.(`Возраст: ${temp.ageValue} лет`);
  await sendAgeSlider(ctx, "edit");
}
