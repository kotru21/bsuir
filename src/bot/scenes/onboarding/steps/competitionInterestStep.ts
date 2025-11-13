import type { RecommendationContext } from "../../../session.js";
import { ensureProfile, ensureTemp } from "../../../session.js";
import { assembleUserProfile } from "../../../../services/profileAssembler.js";
import {
  recommendSections,
  fallbackSection,
} from "../../../../recommendation.js";
import { buildCompletionKeyboard } from "../../../keyboards.js";
import { escapeMarkdown } from "../../../formatters.js";
import { replyMarkdownV2Safe } from "../../../telegram.js";
import type { RecommendationResult } from "../../../../types.js";
import { recordSubmission } from "../../../../services/submissionRecorder.js";
import { generateRecommendationSummary } from "../../../../services/aiSummary.js";
import { sendWizardRecommendationCard } from "../../../services/recommendationPresenter.js";

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
  const temp = ensureTemp(ctx);

  if (!temp.processingMessageId) {
    try {
      const processingMessage = await ctx.reply(
        "Подбираем подходящую секцию, пожалуйста, подождите..."
      );
      temp.processingMessageId = processingMessage.message_id;
    } catch (err) {
      console.error("Failed to send processing notice:", err);
    }
  }

  try {
    let recommendations: RecommendationResult[] = [];
    try {
      recommendations = recommendSections(profile, 3);
    } catch (err) {
      console.error("recommendSections error:", err);
    }

    let finalRecommendations = recommendations;

    if (!finalRecommendations.length) {
      let fallback: RecommendationResult | null = null;
      try {
        fallback = fallbackSection(profile);
      } catch (err) {
        console.error("fallbackSection error:", err);
      }

      if (fallback) {
        finalRecommendations = [fallback];
      }
    }

    temp.recommendations = finalRecommendations;

    if (!finalRecommendations.length) {
      await ctx.reply(
        "Не удалось подобрать точное совпадение. Попробуйте изменить ответы командой /start."
      );
    } else {
      const aiSummaryResult = await generateRecommendationSummary(
        profile,
        finalRecommendations
      );

      if (aiSummaryResult.content) {
        temp.aiSummary = aiSummaryResult.content;
        const text = ["*Краткое пояснение*", aiSummaryResult.content].join(" ");
        await replyMarkdownV2Safe(ctx, text);
      } else {
        temp.aiSummary = undefined;
        if (aiSummaryResult.attempted) {
          await ctx.reply(
            "⚠️ Не удалось получить пояснение от AI. Показываю результаты стандартного алгоритма."
          );
        }
      }

      temp.recommendationIndex = 0;
      await sendWizardRecommendationCard(ctx, 0, finalRecommendations);
    }

    try {
      await recordSubmission({
        profile,
        recommendations: temp.recommendations ?? [],
        telegramUserId: ctx.from?.id,
        chatId: ctx.chat?.id,
        aiSummary: temp.aiSummary,
      });
    } catch (err) {
      console.error("Failed to persist survey submission", err);
    }
  } finally {
    if (temp.processingMessageId) {
      await ctx.deleteMessage(temp.processingMessageId).catch(() => undefined);
      delete temp.processingMessageId;
    }
  }

  await ctx.reply(
    "Команда /sections покажет все направления. Используйте кнопки ниже для быстрого доступа.",
    buildCompletionKeyboard()
  );

  await ctx.scene.leave();
}
