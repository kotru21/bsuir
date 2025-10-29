import { Scenes, Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import type { RecommendationContext } from "./session.js";
import { onboardingScene } from "./scenes/onboarding.js";
import { registerCoreCommands } from "./handlers/commands.js";
import { registerSectionHandlers } from "./handlers/sections.js";
import { wrapBotHandler } from "./utils/safeHandler.js";

export function configureBot(bot: Telegraf<RecommendationContext>): void {
  const stage = new Scenes.Stage<RecommendationContext>([onboardingScene]);
  bot.use(session());
  bot.use(stage.middleware());

  registerCoreCommands(bot);
  registerSectionHandlers(bot);

  bot.on(
    message("text"),
    wrapBotHandler(async (ctx, next) => {
      if (ctx.scene?.current) {
        return next();
      }
      await ctx.reply("Введите /start, чтобы запустить подбор секции.");
    })
  );

  bot.catch((err: unknown, ctx: RecommendationContext) => {
    console.error(`Bot error for update ${ctx.update.update_id}:`, err);
  });
}
