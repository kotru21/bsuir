import type { RecommendationContext } from "../session.js";

function logError(label: string, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`${label}:`, message, err);
}

async function respondWithFailure(ctx: RecommendationContext): Promise<void> {
  if (ctx?.callbackQuery && typeof ctx.answerCbQuery === "function") {
    try {
      await ctx.answerCbQuery("Произошла ошибка. Попробуйте ещё раз позже.", {
        show_alert: true,
      });
    } catch (cbErr) {
      console.error("Failed to answer callback query after error:", cbErr);
    }
  }

  if (ctx && typeof ctx.reply === "function") {
    try {
      await ctx.reply("Произошла ошибка. Попробуйте ещё раз позже.");
    } catch (replyErr) {
      console.error("Failed to send error notification:", replyErr);
    }
  }
}

export type BotHandler<TRest extends unknown[]> = (
  ctx: RecommendationContext,
  ...rest: TRest
) => Promise<unknown>;

async function handleFailure(
  ctx: RecommendationContext,
  label: string,
  err: unknown
): Promise<void> {
  logError(label, err);
  await respondWithFailure(ctx);
}

export function wrapBotHandler<TRest extends unknown[]>(
  handler: BotHandler<TRest>,
  label = "Handler error"
): BotHandler<TRest> {
  return async (ctx: RecommendationContext, ...rest: TRest) => {
    try {
      await handler(ctx, ...rest);
    } catch (err) {
      await handleFailure(ctx, label, err);
    }
  };
}

export function wrapSceneStep(
  step: BotHandler<unknown[]>,
  label = "Scene step error"
): BotHandler<unknown[]> {
  return async (ctx: RecommendationContext, ...rest: unknown[]) => {
    try {
      await step(ctx, ...rest);
    } catch (err) {
      await handleFailure(ctx, label, err);
      try {
        await ctx.scene.leave();
      } catch (leaveErr) {
        console.error("Failed to leave scene after error:", leaveErr);
      }
    }
  };
}
