import dotenv from "dotenv";
import { Scenes, Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { listAllSections } from "./recommendation.js";
import fs from "fs";
import path from "path";
import { onboardingScene } from "./bot/scenes/onboarding.js";
import { RecommendationContext, RecommendationSession } from "./bot/session.js";
import {
  renderRecommendationDetail,
  escapeMarkdown,
} from "./bot/formatters.js";
import {
  buildCompletionKeyboard,
  buildSectionsKeyboard,
} from "./bot/keyboards.js";
import {
  replyMarkdownV2Safe,
  replyWithPhotoMarkdownV2Safe,
} from "./bot/telegram.js";

dotenv.config();

type NodeProcessLike = {
  env?: Record<string, string | undefined>;
  exit?: (code?: number) => never;
  once?: (event: string, handler: () => void) => void;
  on?: (event: string, handler: (...args: any[]) => void) => void;
};

const nodeProcess = (
  globalThis as typeof globalThis & { process?: NodeProcessLike }
).process;

const BOT_TOKEN = nodeProcess?.env?.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error(
    "Не найден BOT_TOKEN. Укажите его в переменных окружения или файле .env."
  );
  throw new Error("Missing BOT_TOKEN");
}

const stage = new Scenes.Stage<RecommendationContext>([onboardingScene]);

const bot = new Telegraf<RecommendationContext>(BOT_TOKEN);

function resolveImagePath(image: string): string | null {
  // Try as given (relative to cwd)
  const abs = path.resolve(process.cwd(), image);
  if (fs.existsSync(abs)) return abs;

  // Try relative to src/ (useful when running from project root and images live in src/data/images)
  const altSrc = path.resolve(
    process.cwd(),
    "src",
    image.replace(/^\.\/[\\/]?/, "")
  );
  if (fs.existsSync(altSrc)) return altSrc;

  // Try relative to dist/ (useful after tsc build and running from dist)
  const altDist = path.resolve(
    process.cwd(),
    "dist",
    image.replace(/^\.\/[\\/]?/, "")
  );
  if (fs.existsSync(altDist)) return altDist;

  return null;
}

function setupProcessErrorHandling(): void {
  if (!nodeProcess?.on) {
    return;
  }

  nodeProcess.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
  });
}

setupProcessErrorHandling();

bot.use(session());
bot.use(stage.middleware());

// A small helper to wrap handlers and send a friendly message on error.
function safe(handler: (...args: any[]) => Promise<any>) {
  return async (...args: any[]) => {
    const ctx = args[0] as RecommendationContext | undefined;
    try {
      await handler(...args);
    } catch (err) {
      console.error("Handler error:", err);
      if (ctx?.callbackQuery && typeof ctx.answerCbQuery === "function") {
        try {
          await ctx.answerCbQuery(
            "Произошла ошибка. Попробуйте ещё раз позже.",
            { show_alert: true }
          );
        } catch (cbErr) {
          console.error("Failed to answer callback query after error:", cbErr);
        }
      }
      try {
        if (ctx && typeof ctx.reply === "function") {
          await ctx.reply("Произошла ошибка. Попробуйте ещё раз позже.");
        }
      } catch (replyErr) {
        console.error("Failed to send error notification:", replyErr);
      }
    }
  };
}

bot.start(
  safe(async (ctx: RecommendationContext) => {
    // Показываем клавиатуру снизу сразу при нажатии /start
    try {
      await ctx.reply("Команды доступны ниже:", buildCompletionKeyboard());
    } catch {
      // ignore reply errors
    }
    return ctx.scene.enter("onboarding");
  })
);
bot.command(
  "restart",
  safe((ctx: RecommendationContext) => ctx.scene.enter("onboarding"))
);

bot.command(
  "sections",
  safe(async (ctx: RecommendationContext) => {
    const sections = listAllSections();
    if (!sections || sections.length === 0) {
      await ctx.reply("Секции не найдены.");
      return;
    }

    const first = sections[0];
    const image = (first as any).imagePath ?? null;
    const caption = [
      `*${escapeMarkdown(first.title)}*`,
      escapeMarkdown(first.summary),
    ].join("\n");

    if (image) {
      const abs = resolveImagePath(image);
      if (!abs) {
        await ctx.reply("Изображение не найдено на сервере.");
        return;
      }
      await replyWithPhotoMarkdownV2Safe(
        ctx,
        () => ({ source: fs.createReadStream(abs) }),
        {
          caption,
          parse_mode: "MarkdownV2",
          reply_markup: buildSectionsKeyboard(0, sections.length, first.id)
            .reply_markup,
        }
      );
    } else {
      const text = sections
        .map((s) => `• ${s.title} — ${s.summary}`)
        .map((line) => escapeMarkdown(line))
        .join("\n\n");
      await replyMarkdownV2Safe(ctx, text);
    }
  })
);

bot.action(
  /^sections:(.+)$/i,
  safe(async (ctx: RecommendationContext) => {
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

    const section = sections[index];
    const image = (section as any).imagePath ?? null;
    const caption = [
      `*${escapeMarkdown(section.title)}*`,
      escapeMarkdown(section.summary),
    ].join("\n");

    await ctx.answerCbQuery?.();

    try {
      const cb = ctx.callbackQuery as any;
      const msg = cb && cb.message;
      if (image) {
        const abs = resolveImagePath(image);
        if (!abs) {
          await ctx.answerCbQuery?.("Изображение не найдено на сервере.", {
            show_alert: true,
          });
          return;
        }
        // Try to remove previous message (user-facing) and send a new photo
        if (msg) {
          try {
            await ctx.telegram.deleteMessage(
              String(msg.chat.id),
              msg.message_id
            );
          } catch {
            // ignore delete errors
          }
        }
        await replyWithPhotoMarkdownV2Safe(
          ctx,
          () => ({ source: fs.createReadStream(abs) }),
          {
            caption,
            parse_mode: "MarkdownV2",
            reply_markup: buildSectionsKeyboard(
              index,
              sections.length,
              section.id
            ).reply_markup,
          }
        );
      } else {
        await replyMarkdownV2Safe(
          ctx,
          caption,
          buildSectionsKeyboard(index, sections.length, section.id)
        );
      }
    } catch (err) {
      console.error("Failed to update section message:", err);
      if (image) {
        const abs = path.resolve(process.cwd(), image);
        if (fs.existsSync(abs)) {
          await replyWithPhotoMarkdownV2Safe(
            ctx,
            () => ({ source: fs.createReadStream(abs) }),
            {
              caption,
              parse_mode: "MarkdownV2",
              reply_markup: buildSectionsKeyboard(
                index,
                sections.length,
                section.id
              ).reply_markup,
            }
          );
        } else {
          await replyMarkdownV2Safe(ctx, caption);
        }
      } else {
        await replyMarkdownV2Safe(ctx, caption);
      }
    }
  })
);

bot.action(
  /^rec:(.+)$/i,
  safe(async (ctx: RecommendationContext) => {
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

    // Try to find the recommendation in the session first
    let recIndex = recommendations.findIndex(
      (item) => item.section.id === sectionId
    );

    let recommendationToShow: any = null;

    if (recIndex !== -1) {
      recommendationToShow = recommendations[recIndex];
    } else {
      // Fallback: try to find the section in the global list and show its details
      try {
        const all = listAllSections();
        const sec = all.find((s) => s.id === sectionId) ?? null;
        if (sec) {
          recommendationToShow = {
            section: sec,
            score: 0,
            matchedFocus: [],
            formatMatch: false,
            reason: ["Информация из каталога"],
          };
          // set recIndex to 0 for rendering position
          recIndex = 0;
        }
      } catch (err) {
        console.error("Failed to load sections for fallback rec:", err);
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

bot.on(
  message("text"),
  safe(async (ctx: RecommendationContext, next: () => Promise<void>) => {
    if (ctx.scene?.current) {
      return next();
    }
    await ctx.reply("Введите /start, чтобы запустить подбор секции.");
  })
);

bot.catch((err: unknown, ctx: RecommendationContext) => {
  console.error(`Bot error for update ${ctx.update.update_id}:`, err);
});

bot
  .launch()
  .then(() => {
    console.log("Telegram-бот запущен.");
  })
  .catch((err) => {
    console.error("Failed to launch Telegram bot:", err);
    nodeProcess?.exit?.(1);
  });
nodeProcess?.once?.("SIGINT", () => bot.stop("SIGINT"));
nodeProcess?.once?.("SIGTERM", () => bot.stop("SIGTERM"));
