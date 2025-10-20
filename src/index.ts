import dotenv from "dotenv";
import { Scenes, Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { listAllSections } from "./recommendation.js";
import fs from "fs";
import path from "path";
import { onboardingScene } from "./bot/scenes/onboarding.js";
import { RecommendationContext, RecommendationSession } from "./bot/session.js";
import { renderRecommendationDetail } from "./bot/formatters.js";
import {
  buildCompletionKeyboard,
  buildSectionsKeyboard,
} from "./bot/keyboards.js";

dotenv.config();

type NodeProcessLike = {
  env?: Record<string, string | undefined>;
  exit?: (code?: number) => never;
  once?: (event: string, handler: () => void) => void;
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

bot.use(session());
bot.use(stage.middleware());

// A small helper to wrap handlers and send a friendly message on error.
function safe(handler: (...args: any[]) => Promise<any>) {
  return async (...args: any[]) => {
    try {
      await handler(...args);
    } catch (err) {
      console.error("Handler error:", err);
      const ctx = args[0] as RecommendationContext | undefined;
      try {
        if (ctx && typeof ctx.reply === "function") {
          await ctx.reply("Произошла ошибка. Попробуйте ещё раз позже.");
        }
      } catch {
        // ignore reply errors
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
    const caption = `*${first.title}*\n${first.summary}`;

    if (image) {
      const abs = path.resolve(process.cwd(), image);
      if (!fs.existsSync(abs)) {
        await ctx.reply("Изображение не найдено на сервере.");
        return;
      }
      await ctx.replyWithPhoto(
        { source: fs.createReadStream(abs) },
        {
          caption,
          parse_mode: "Markdown",
          reply_markup: buildSectionsKeyboard(0, sections.length, first.id)
            .reply_markup,
        }
      );
    } else {
      const text = sections
        .map((s) => `• ${s.title} — ${s.summary}`)
        .join("\n\n");
      await ctx.reply(text);
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
    const caption = `*${section.title}*\n${section.summary}`;

    await ctx.answerCbQuery?.();

    try {
      const cb = ctx.callbackQuery as any;
      const msg = cb && cb.message;
      if (image) {
        const abs = path.resolve(process.cwd(), image);
        if (!fs.existsSync(abs)) {
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
        await ctx.replyWithPhoto(
          { source: fs.createReadStream(abs) },
          {
            caption,
            parse_mode: "Markdown",
            reply_markup: buildSectionsKeyboard(
              index,
              sections.length,
              section.id
            ).reply_markup,
          }
        );
      } else {
        await ctx.reply(caption, {
          parse_mode: "Markdown",
          reply_markup: buildSectionsKeyboard(
            index,
            sections.length,
            section.id
          ).reply_markup,
        });
      }
    } catch (err) {
      console.error("Failed to update section message:", err);
      if (image) {
        const abs = path.resolve(process.cwd(), image);
        if (fs.existsSync(abs)) {
          await ctx.replyWithPhoto(
            { source: fs.createReadStream(abs) },
            {
              caption,
              parse_mode: "Markdown",
              reply_markup: buildSectionsKeyboard(
                index,
                sections.length,
                section.id
              ).reply_markup,
            }
          );
        } else {
          await ctx.reply(caption);
        }
      } else {
        await ctx.reply(caption);
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
    const recommendations = session.temp?.recommendations;
    if (!recommendations || !recommendations.length) {
      await ctx.answerCbQuery?.("Данные недоступны. Пройдите подбор заново.", {
        show_alert: true,
      });
      return;
    }
    const index = recommendations.findIndex(
      (item) => item.section.id === sectionId
    );
    if (index === -1) {
      await ctx.answerCbQuery?.(
        "Рекомендация устарела. Запустите подбор заново.",
        { show_alert: true }
      );
      return;
    }
    await ctx.answerCbQuery?.();
    const detail = renderRecommendationDetail(
      index + 1,
      recommendations[index]
    );
    await ctx.replyWithMarkdownV2(detail);
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

bot.launch().then(() => {
  console.log("Telegram-бот запущен.");
});
nodeProcess?.once?.("SIGINT", () => bot.stop("SIGINT"));
nodeProcess?.once?.("SIGTERM", () => bot.stop("SIGTERM"));
