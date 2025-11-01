import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import type { RecommendationContext } from "./bot/session.js";
import { configureBot } from "./bot/app.js";
import { loadAdminConfig } from "./admin/config.js";
import { buildAdminServer } from "./admin/server.js";
import {
  connectPrisma,
  disconnectPrisma,
} from "./infrastructure/prismaClient.js";

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
const adminConfig = loadAdminConfig(nodeProcess?.env ?? {});
const hasDatabase = Boolean(nodeProcess?.env?.DATABASE_URL);

let adminServer: Awaited<ReturnType<typeof buildAdminServer>> | null = null;

function setupProcessErrorHandling(): void {
  if (!nodeProcess?.on) {
    return;
  }

  nodeProcess.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
  });
}

setupProcessErrorHandling();

async function start(): Promise<void> {
  if (hasDatabase) {
    try {
      await connectPrisma();
    } catch (err) {
      console.error("Failed to connect to database:", err);
      throw err;
    }
  } else {
    console.warn(
      "DATABASE_URL is not configured. Analytics persistence disabled."
    );
  }

  configureBot(bot);

  try {
    await bot.launch();
    console.log("Telegram-бот запущен.");
  } catch (err) {
    console.error("Failed to launch Telegram bot:", err);
    throw err;
  }

  try {
    adminServer = await buildAdminServer({
      config: adminConfig,
      trustProxy: true,
    });

    const port = Number(nodeProcess?.env?.PORT ?? 3000);
    await adminServer.listen({ port, host: "0.0.0.0" });
    console.log(`Админ-панель доступна по порту ${port}.`);
  } catch (err) {
    console.error("Failed to start admin server:", err);
    throw err;
  }
}

void start().catch((err) => {
  console.error("Startup error:", err);
  nodeProcess?.exit?.(1);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`Получен сигнал ${signal}, останавливаем сервисы...`);
  await bot.stop(signal);

  if (adminServer) {
    try {
      await adminServer.close();
    } catch (err) {
      console.error("Failed to close admin server:", err);
    }
  }

  if (hasDatabase) {
    await disconnectPrisma();
  }
  nodeProcess?.exit?.(0);
}

if (nodeProcess?.once) {
  nodeProcess.once("SIGINT", () => {
    void shutdown("SIGINT");
  });
  nodeProcess.once("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}
