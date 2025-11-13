import type { Telegraf } from "telegraf";
import type {
  RecommendationContext,
  RecommendationSession,
} from "../session.js";
import { ensureTemp } from "../session.js";
import { wrapBotHandler } from "../utils/safeHandler.js";
import { sendWizardRecommendationCard } from "../services/recommendationPresenter.js";

export function registerRecommendationCarouselHandlers(
  bot: Telegraf<RecommendationContext>
): void {
  bot.action(
    /^wizardrec:(.+)$/i,
    wrapBotHandler(async (ctx) => {
      const callback = ctx.callbackQuery;
      const raw = callback && "data" in callback ? callback.data ?? "" : "";
      if (!raw) {
        await ctx.answerCbQuery?.();
        return;
      }

      const payload = raw.slice(raw.indexOf(":") + 1);
      if (!payload || payload === "noop") {
        await ctx.answerCbQuery?.();
        return;
      }

      const index = Number(payload);
      const session = ctx.session as RecommendationSession;
      const recommendations = session.temp?.recommendations ?? [];

      if (!recommendations.length) {
        await ctx.answerCbQuery?.(
          "Рекомендации устарели. Запустите подбор заново командой /start.",
          { show_alert: true }
        );
        return;
      }

      if (Number.isNaN(index) || index < 0 || index >= recommendations.length) {
        await ctx.answerCbQuery?.("Неверный номер рекомендации.", {
          show_alert: true,
        });
        return;
      }

      await ctx.answerCbQuery?.();

      const message =
        callback && "message" in callback ? callback.message : undefined;
      if (message) {
        try {
          await ctx.telegram.deleteMessage(
            String(message.chat.id),
            message.message_id
          );
        } catch {
          /* ignore delete errors */
        }
      }

      await sendWizardRecommendationCard(ctx, index, recommendations);
      ensureTemp(ctx).recommendationIndex = index;
    })
  );
}
