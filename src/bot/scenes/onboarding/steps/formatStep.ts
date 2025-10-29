import type { RecommendationContext } from "../../../session.js";
import type { TrainingFormat } from "../../../../types.js";
import { ensureProfile, ensureTemp } from "../../../session.js";
import {
  sendFormatPrompt,
  sendGoalPrompt,
  sendTransientMessage,
} from "../prompts.js";

export async function formatStep(ctx: RecommendationContext): Promise<void> {
  if (ctx.updateType !== "callback_query") {
    if (ctx.message && "text" in ctx.message) {
      await sendTransientMessage(ctx, "Выберите форматы занятий кнопками.");
    }
    return;
  }

  const callback = ctx.callbackQuery;
  const data = callback && "data" in callback ? callback.data : undefined;
  if (!data || !data.startsWith("format:")) {
    await ctx.answerCbQuery?.();
    return;
  }

  const temp = ensureTemp(ctx);
  if (!temp.formatSelection) {
    temp.formatSelection = [];
  }

  const action = data.split(":")[1];

  if (action === "any") {
    temp.formatSelection = [];
    await ctx.answerCbQuery?.("Предпочтение сброшено.");
    await sendFormatPrompt(ctx, "edit");
    return;
  }

  if (action === "done") {
    ensureProfile(ctx).preferredFormats = temp.formatSelection;
    await ctx.answerCbQuery?.("Предпочтения сохранены.");
    if (callback && "message" in callback && callback.message) {
      await ctx
        .deleteMessage(callback.message.message_id)
        .catch(() => undefined);
    }
    await sendGoalPrompt(ctx, "new");
    await ctx.wizard.next();
    return;
  }

  const format = action as TrainingFormat;
  if (temp.formatSelection.includes(format)) {
    temp.formatSelection = temp.formatSelection.filter(
      (item) => item !== format
    );
    await ctx.answerCbQuery?.("Удалено из списка.");
  } else {
    temp.formatSelection.push(format);
    await ctx.answerCbQuery?.("Добавлено в список.");
  }

  await sendFormatPrompt(ctx, "edit");
}
