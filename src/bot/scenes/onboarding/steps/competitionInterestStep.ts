import type { RecommendationContext } from "../../../session.js";
import { ensureProfile, ensureTemp } from "../../../session.js";
import { assembleUserProfile } from "../../../../services/profileAssembler.js";
import {
  recommendSections,
  fallbackSection,
} from "../../../../recommendation.js";
import {
  buildCompletionKeyboard,
  buildRecommendationKeyboard,
} from "../../../keyboards.js";
import { renderRecommendationSummary } from "../../../formatters.js";
import { replyMarkdownV2Safe } from "../../../telegram.js";
import type { RecommendationResult } from "../../../../types.js";
import { recordSubmission } from "../../../../services/submissionRecorder.js";

export async function competitionInterestStep(
  ctx: RecommendationContext
): Promise<void> {
  if (ctx.updateType !== "callback_query") {
    if (ctx.message && "text" in ctx.message) {
      await ctx.reply("Пожалуйста, выберите кнопку 'Да' или 'Нет'.");
    }
    return;
  }

  const callback = ctx.callbackQuery;
  const data = callback && "data" in callback ? callback.data : undefined;
  if (!data || !data.startsWith("competition:")) {
    await ctx.answerCbQuery?.();
    return;
  }

  const interested = data.endsWith("yes");
  ensureProfile(ctx).interestedInCompetition = interested;
  await ctx.answerCbQuery?.(
    interested
      ? "Учтем интерес к соревнованиям."
      : "Сфокусируемся на общей подготовке."
  );

  if (callback && "message" in callback && callback.message) {
    await ctx.deleteMessage(callback.message.message_id).catch(() => undefined);
  }

  const profile = assembleUserProfile(ensureProfile(ctx));

  let recommendations: RecommendationResult[] = [];
  try {
    recommendations = recommendSections(profile, 3);
  } catch (err) {
    console.error("recommendSections error:", err);
  }

  const temp = ensureTemp(ctx);
  temp.recommendations = recommendations;

  if (!recommendations.length) {
    let fallback: RecommendationResult | null = null;
    try {
      fallback = fallbackSection(profile);
    } catch (err) {
      console.error("fallbackSection error:", err);
    }

    if (fallback) {
      temp.recommendations = [fallback];
      const summary = renderRecommendationSummary(1, fallback);
      await replyMarkdownV2Safe(
        ctx,
        summary,
        buildRecommendationKeyboard(fallback.section.id)
      );
    } else {
      await ctx.reply(
        "Не удалось подобрать точное совпадение. Попробуйте изменить ответы командой /start."
      );
    }
  } else {
    for (const [index, item] of recommendations.entries()) {
      const summary = renderRecommendationSummary(index + 1, item);
      await replyMarkdownV2Safe(
        ctx,
        summary,
        buildRecommendationKeyboard(item.section.id)
      );
    }
  }

  try {
    await recordSubmission({
      profile,
      recommendations: temp.recommendations ?? [],
      telegramUserId: ctx.from?.id,
      chatId: ctx.chat?.id,
    });
  } catch (err) {
    console.error("Failed to persist survey submission", err);
  }

  await ctx.reply(
    "Команда /sections покажет все направления. Используйте кнопки ниже для быстрого доступа.",
    buildCompletionKeyboard()
  );

  await ctx.scene.leave();
}
