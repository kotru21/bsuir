import fs from "fs";
import type { RecommendationContext } from "../session.js";
import type { RecommendationResult } from "../../types.js";
import { renderRecommendationSummary } from "../formatters.js";
import {
  buildRecommendationKeyboard,
  buildRecommendationCarouselKeyboard,
} from "../keyboards.js";
import {
  replyMarkdownV2Safe,
  replyWithPhotoMarkdownV2Safe,
} from "../telegram.js";
import { resolveImagePath } from "./imageResolver.js";

export async function sendWizardRecommendationCard(
  ctx: RecommendationContext,
  index: number,
  recommendations: RecommendationResult[]
): Promise<void> {
  const total = recommendations.length;
  const recommendation = recommendations[index];
  const summary = renderRecommendationSummary(index + 1, recommendation);

  const keyboard =
    total > 1
      ? buildRecommendationCarouselKeyboard(
          index,
          total,
          recommendation.section.id
        )
      : buildRecommendationKeyboard(recommendation.section.id);

  const imagePath = recommendation.section.imagePath;
  // record impression (useful for ml/clickthrough metrics)
  try {
    const { recordRecommendationEvent } = await import(
      "../../services/submissionRecorder.js"
    );
    await recordRecommendationEvent({
      telegramUserId: (ctx.from && ctx.from.id) ?? undefined,
      chatId: ctx.chat?.id ?? undefined,
      sectionId: recommendation.section.id,
      eventType: "impression",
      payload: { index, total: recommendations.length },
    });
  } catch (_err) {
    /* ignore */
  }
  if (!imagePath) {
    await replyMarkdownV2Safe(ctx, summary, keyboard);
    return;
  }

  const resolved = resolveImagePath(imagePath);
  if (!resolved) {
    console.warn(
      `Image for section ${recommendation.section.id} not found at ${imagePath}.`
    );
    await replyMarkdownV2Safe(ctx, summary, keyboard);
    return;
  }

  await replyWithPhotoMarkdownV2Safe(
    ctx,
    () => ({
      source: fs.createReadStream(resolved),
    }),
    {
      caption: summary,
      parse_mode: "MarkdownV2",
      reply_markup: keyboard.reply_markup,
    }
  );
}
