import dotenv from "dotenv";
import { Scenes, Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { listAllSections } from "./recommendation.js";
import { onboardingScene } from "./bot/scenes/onboarding.js";
import { RecommendationContext, RecommendationSession } from "./bot/session.js";
import { renderRecommendationDetail } from "./bot/formatters.js";

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

bot.start(safe((ctx: RecommendationContext) => ctx.scene.enter("onboarding")));
bot.command(
  "restart",
  safe((ctx: RecommendationContext) => ctx.scene.enter("onboarding"))
);

bot.command(
  "sections",
  safe(async (ctx: RecommendationContext) => {
    const sections = listAllSections()
      .map((section) => `• ${section.title} — ${section.summary}`)
      .join("\n");
    await ctx.reply(sections);
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
