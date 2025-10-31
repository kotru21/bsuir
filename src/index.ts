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

function isTelegramConflictError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as {
    response?: { error_code?: number; description?: string };
  };

  return maybeError.response?.error_code === 409;
}

async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function launchWithRetry(): Promise<void> {
  let attempt = 0;
  let launched = false;

  while (!launched) {
    try {
      await bot.telegram.deleteWebhook({ drop_pending_updates: false });
      await bot.launch();
      console.log("Telegram-бот запущен.");
      launched = true;
    } catch (error) {
      if (!isTelegramConflictError(error)) {
        throw error;
      }

      attempt += 1;
      const backoffSeconds = Math.min(30, 2 ** Math.min(attempt, 5));
      console.warn(
        `Обнаружен параллельный инстанс бота (409 conflict). Повторный запуск через ${backoffSeconds} c.`
      );

      try {
        await bot.stop("retry");
      } catch (stopError) {
        console.warn(
          "Не удалось корректно остановить бот перед повтором:",
          stopError
        );
      }

      await wait(backoffSeconds * 1000);
    }
  }
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

configureBot(bot);

launchWithRetry().catch((err) => {
  console.error("Failed to launch Telegram bot:", err);
  nodeProcess?.exit?.(1);
});
nodeProcess?.once?.("SIGINT", () => bot.stop("SIGINT"));
nodeProcess?.once?.("SIGTERM", () => bot.stop("SIGTERM"));
