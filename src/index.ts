import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import type { RecommendationContext } from "./bot/session.js";
import { configureBot } from "./bot/app.js";

dotenv.config();

type NodeProcessLike = {
  env?: Record<string, string | undefined>;
  exit?: (code?: number) => never;
  once?: (event: string, handler: () => void) => void;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
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

const bot = new Telegraf<RecommendationContext>(BOT_TOKEN);

function setupProcessErrorHandling(): void {
  if (!nodeProcess?.on) {
    return;
  }

  nodeProcess.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
  });
}

setupProcessErrorHandling();

configureBot(bot);

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
