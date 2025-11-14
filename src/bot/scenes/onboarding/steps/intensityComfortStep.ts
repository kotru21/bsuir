import type { RecommendationContext } from "../../../session.js";
import { ensureProfile } from "../../../session.js";
import { sendFormatPrompt, sendTransientMessage } from "../prompts.js";
import { resetPromptState } from "../helpers.js";

const intensityPresets = {
  steady: {
    comfort: 0.2,
    flexibility: 0.2,
    label: "Бережно",
  },
  balanced: {
    comfort: 0.5,
    flexibility: 0.5,
    label: "Сбалансировано",
  },
  push: {
    comfort: 0.85,
    flexibility: 0.8,
    label: "Готов к интенсивности",
  },
} as const;

type IntensityPresetKey = keyof typeof intensityPresets;

export async function intensityComfortStep(
  ctx: RecommendationContext
): Promise<void> {
  if (ctx.updateType !== "callback_query") {
    if (ctx.message && "text" in ctx.message) {
      await sendTransientMessage(
        ctx,
        "Выберите предпочтение по нагрузке с помощью кнопок."
      );
    }
    return;
  }

  const callback = ctx.callbackQuery;
  const data = callback && "data" in callback ? callback.data ?? "" : "";
  if (!data.startsWith("intensitypref:")) {
    await ctx.answerCbQuery?.();
    return;
  }

  const presetKey = data.split(":")[1] as IntensityPresetKey;
  const preset = intensityPresets[presetKey];
  if (!preset) {
    await ctx.answerCbQuery?.();
    return;
  }

  const profile = ensureProfile(ctx);
  profile.intensityComfort = preset.comfort;
  profile.intensityFlexibility = preset.flexibility;
  await ctx.answerCbQuery?.(`${preset.label}: учтём при подборе.`);

  const messageId =
    callback && "message" in callback
      ? callback.message?.message_id
      : undefined;
  if (messageId) {
    await ctx.deleteMessage(messageId).catch(() => undefined);
  }

  resetPromptState(ctx);
  await sendFormatPrompt(ctx, "new");
  await ctx.wizard.next();
}
