import fs from "fs";
import type { Telegraf } from "telegraf";
import { listAllSections } from "../../recommendation.js";
import { buildSectionsKeyboard } from "../keyboards.js";
import {
  replyMarkdownV2Safe,
  replyWithPhotoMarkdownV2Safe,
} from "../telegram.js";
import { renderRecommendationDetail, escapeMarkdown } from "../formatters.js";
import type {
  RecommendationContext,
  RecommendationSession,
} from "../session.js";
import { wrapBotHandler } from "../utils/safeHandler.js";
import { resolveImagePath } from "../services/imageResolver.js";
import type { RecommendationResult } from "../../types.js";

function buildSectionCaption(section: RecommendationResult["section"]): string {
  return [
    `*${escapeMarkdown(section.title)}*`,
    escapeMarkdown(section.summary),
  ].join("\n");
}

async function sendSectionCard(
  ctx: RecommendationContext,
  sectionIndex: number,
  sections: RecommendationResult["section"][]
): Promise<void> {
  const section = sections[sectionIndex];
  const caption = buildSectionCaption(section);
  const keyboard = buildSectionsKeyboard(
    sectionIndex,
    sections.length,
    section.id
  );

  const image = (section as { imagePath?: string }).imagePath ?? null;
  if (!image) {
    await replyMarkdownV2Safe(ctx, caption, keyboard);
    return;
  }

  const resolved = resolveImagePath(image);
  if (!resolved) {
    await ctx.reply("Изображение не найдено на сервере.");
    await replyMarkdownV2Safe(ctx, caption, keyboard);
    return;
  }

  await replyWithPhotoMarkdownV2Safe(
    ctx,
    () => ({ source: fs.createReadStream(resolved) }),
    {
      caption,
      parse_mode: "MarkdownV2",
      reply_markup: keyboard.reply_markup,
    }
  );
}

function buildCatalogRecommendation(
  section: RecommendationResult["section"]
): RecommendationResult {
  return {
    section,
    score: 0,
    matchedFocus: [],
    formatMatch: false,
    reasons: [{ kind: "catalog-reference", note: "Информация из каталога." }],
  };
}

export function registerSectionHandlers(
  bot: Telegraf<RecommendationContext>
): void {
  bot.command(
    "sections",
    wrapBotHandler(async (ctx) => {
      const sections = listAllSections();
      if (!sections.length) {
        await ctx.reply("Секции не найдены.");
        return;
      }

      await sendSectionCard(ctx, 0, sections);
    })
  );

  bot.action(
    /^sections:(.+)$/i,
    wrapBotHandler(async (ctx) => {
      const raw =
        ctx.callbackQuery && "data" in ctx.callbackQuery
          ? ctx.callbackQuery.data ?? ""
          : "";
      if (!raw) {
        await ctx.answerCbQuery?.();
        return;
      }
      const payload = raw.slice(raw.indexOf(":") + 1);
      if (payload === "noop") {
        await ctx.answerCbQuery?.();
        return;
      }
      const index = Number(payload);
      const sections = listAllSections();
      if (Number.isNaN(index) || index < 0 || index >= sections.length) {
        await ctx.answerCbQuery?.("Неправильный индекс.", { show_alert: true });
        return;
      }

      await ctx.answerCbQuery?.();

      const cb = ctx.callbackQuery;
      const message = cb && "message" in cb ? cb.message : undefined;

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

      await sendSectionCard(ctx, index, sections);
    })
  );

  bot.action(
    /^rec:(.+)$/i,
    wrapBotHandler(async (ctx) => {
      const callback = ctx.callbackQuery;
      const raw = callback && "data" in callback ? callback.data ?? "" : "";
      if (!raw.toLowerCase().startsWith("rec:")) {
        await ctx.answerCbQuery?.();
        return;
      }
      const sectionId = raw.slice(4);
      if (!sectionId) {
        await ctx.answerCbQuery?.();
        return;
      }

      const session = ctx.session as RecommendationSession;
      const recommendations = session.temp?.recommendations ?? [];

      let recIndex = recommendations.findIndex(
        (item) => item.section.id === sectionId
      );

      let recommendationToShow: RecommendationResult | null = null;

      if (recIndex !== -1) {
        recommendationToShow = recommendations[recIndex];
      } else {
        const all = listAllSections();
        const fallback = all.find((s) => s.id === sectionId) ?? null;
        if (fallback) {
          recommendationToShow = buildCatalogRecommendation(fallback);
          recIndex = 0;
        }
      }

      if (!recommendationToShow) {
        await ctx.answerCbQuery?.(
          "Рекомендация устарела. Запустите подбор заново.",
          { show_alert: true }
        );
        return;
      }

      await ctx.answerCbQuery?.();
      const detail = renderRecommendationDetail(
        recIndex + 1,
        recommendationToShow
      );
      await replyMarkdownV2Safe(ctx, detail);
    })
  );
}
