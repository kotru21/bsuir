import type { RecommendationContext } from "../../../session.js";
import { ensureProfile } from "../../../session.js";
import { sendPromptMessage, sendTransientMessage } from "../prompts.js";
import { competitionKeyboard } from "../../../keyboards.js";

export async function contactPreferenceStep(
  ctx: RecommendationContext
): Promise<void> {
  if (ctx.updateType !== "callback_query") {
    if (ctx.message && "text" in ctx.message) {
      await sendTransientMessage(
        ctx,
        "Пожалуйста, выберите кнопку 'Да' или 'Нет'."
      );
    }
    return;
  }

  const callback = ctx.callbackQuery;
  const data = callback && "data" in callback ? callback.data : undefined;
  if (!data || !data.startsWith("contact:")) {
    await ctx.answerCbQuery?.();
    return;
  }

  const avoid = data.endsWith("yes");
  ensureProfile(ctx).avoidContact = avoid;
  await ctx.answerCbQuery?.(
    avoid ? "Будем избегать контакта." : "Контакт допустим."
  );

  if (callback && "message" in callback && callback.message) {
    await ctx.deleteMessage(callback.message.message_id).catch(() => undefined);
  }

  await sendPromptMessage(
    ctx,
    "Интересна ли соревновательная подготовка?",
    competitionKeyboard
  );
  await ctx.wizard.next();
}
