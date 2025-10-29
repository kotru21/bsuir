import type { Telegraf } from "telegraf";
import type { RecommendationContext } from "../session.js";
import { buildCompletionKeyboard } from "../keyboards.js";
import { wrapBotHandler } from "../utils/safeHandler.js";

export function registerCoreCommands(
  bot: Telegraf<RecommendationContext>
): void {
  bot.start(
    wrapBotHandler(async (ctx) => {
      try {
        await ctx.reply("Команды доступны ниже:", buildCompletionKeyboard());
      } catch {
        /* ignore reply errors */
      }
      await ctx.scene.enter("onboarding");
    })
  );

  bot.command(
    "restart",
    wrapBotHandler(async (ctx) => {
      await ctx.scene.enter("onboarding");
    })
  );
}
