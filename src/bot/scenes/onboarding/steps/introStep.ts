import type { RecommendationContext } from "../../../session.js";
import { initializeSession } from "../helpers.js";
import { sendAgeSlider } from "../prompts.js";

export async function introStep(ctx: RecommendationContext): Promise<void> {
  initializeSession(ctx);
  await ctx.reply(
    "Здравствуйте! Я помогу подобрать подходящую спортивную секцию БГУИР."
  );
  await sendAgeSlider(ctx, "new");
  await ctx.wizard.next();
}
