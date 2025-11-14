import type { RecommendationContext } from "../../session.js";
import { ensureProfile, ensureTemp } from "../../session.js";
import {
  buildAgeKeyboard,
  buildFormatKeyboard,
  buildFitnessKeyboard,
  buildGoalKeyboard,
} from "../../keyboards.js";
import { buildTimePreferenceKeyboard } from "../../keyboards.js";
import { timeSelectionText } from "../../formatters.js";
import {
  buildAgeSliderText,
  buildFitnessSliderText,
  formatSelectionText,
  goalSelectionText,
} from "../../formatters.js";
import {
  AGE_DEFAULT,
  fitnessLevelLabelsRu,
  fitnessOrder,
} from "../../constants.js";

export type PromptMode = "new" | "edit";

export type ReplyExtra = Parameters<RecommendationContext["reply"]>[1];

export async function cleanupPromptMessage(
  ctx: RecommendationContext
): Promise<void> {
  const temp = ensureTemp(ctx);
  const { promptMessageId, promptChatId } = temp;
  if (promptMessageId === undefined || promptChatId === undefined) {
    return;
  }
  try {
    await ctx.telegram.deleteMessage(promptChatId, promptMessageId);
  } catch (err) {
    console.error("cleanupPromptMessage delete error:", err);
  }
  temp.promptMessageId = undefined;
  temp.promptChatId = undefined;
}

export async function sendPromptMessage(
  ctx: RecommendationContext,
  text: string,
  extra?: ReplyExtra
): Promise<void> {
  await cleanupPromptMessage(ctx);
  const sent = await ctx.reply(text, extra);
  const temp = ensureTemp(ctx);
  temp.promptMessageId = sent.message_id;
  temp.promptChatId = sent.chat.id;
}

export async function sendTransientMessage(
  ctx: RecommendationContext,
  text: string
): Promise<void> {
  const sent = await ctx.reply(text);
  const chatId = sent.chat.id;
  const messageId = sent.message_id;
  setTimeout(() => {
    ctx.telegram.deleteMessage(chatId, messageId).catch(() => undefined);
  }, 6000);
}

export async function sendAgeSlider(
  ctx: RecommendationContext,
  mode: PromptMode = "new"
): Promise<void> {
  const temp = ensureTemp(ctx);
  if (temp.ageValue === undefined) {
    temp.ageValue = AGE_DEFAULT;
  }
  const text = buildAgeSliderText(temp.ageValue);
  const keyboard = buildAgeKeyboard(temp.ageValue);
  try {
    if (mode === "edit" && ctx.callbackQuery?.message) {
      await ctx.editMessageText(text, keyboard);
    } else {
      await sendPromptMessage(ctx, text, keyboard);
    }
  } catch (err) {
    console.error("sendAgeSlider error:", err);
    try {
      await ctx.reply("Не удалось показать слайдер возраста.");
    } catch {
      /* ignore */
    }
  }
}

export async function sendFitnessSlider(
  ctx: RecommendationContext,
  mode: PromptMode = "new"
): Promise<void> {
  const temp = ensureTemp(ctx);
  const profile = ensureProfile(ctx);
  if (temp.fitnessIndex === undefined) {
    const initialLevel = profile.fitnessLevel ?? "medium";
    const initialIndex = fitnessOrder.indexOf(initialLevel);
    temp.fitnessIndex = initialIndex === -1 ? 1 : initialIndex;
  }
  const text = buildFitnessSliderText(temp.fitnessIndex);
  const keyboard = buildFitnessKeyboard(temp.fitnessIndex);
  try {
    if (mode === "edit" && ctx.callbackQuery?.message) {
      await ctx.editMessageText(text, keyboard);
    } else {
      await sendPromptMessage(ctx, text, keyboard);
    }
  } catch (err) {
    console.error("sendFitnessSlider error:", err);
    try {
      await ctx.reply("Не удалось показать выбор уровня.");
    } catch {
      /* ignore */
    }
  }
}

export async function sendFormatPrompt(
  ctx: RecommendationContext,
  mode: PromptMode = "new"
): Promise<void> {
  const temp = ensureTemp(ctx);
  if (!temp.formatSelection) {
    temp.formatSelection = ensureProfile(ctx).preferredFormats ?? [];
  }
  const text = formatSelectionText(temp.formatSelection);
  const keyboard = buildFormatKeyboard(temp.formatSelection);
  try {
    if (mode === "edit" && ctx.callbackQuery?.message) {
      await ctx.editMessageText(text, keyboard);
    } else {
      await sendPromptMessage(ctx, text, keyboard);
    }
  } catch (err) {
    console.error("sendFormatPrompt error:", err);
    try {
      await ctx.reply("Не удалось показать выбор формата.");
    } catch {
      /* ignore */
    }
  }
}

export async function sendGoalPrompt(
  ctx: RecommendationContext,
  mode: PromptMode = "new"
): Promise<void> {
  const temp = ensureTemp(ctx);
  if (!temp.goalSelection) {
    temp.goalSelection = ensureProfile(ctx).desiredGoals ?? [];
  }
  const text = goalSelectionText(temp.goalSelection);
  const keyboard = buildGoalKeyboard(temp.goalSelection);
  try {
    if (mode === "edit" && ctx.callbackQuery?.message) {
      await ctx.editMessageText(text, keyboard);
    } else {
      await sendPromptMessage(ctx, text, keyboard);
    }
  } catch (err) {
    console.error("sendGoalPrompt error:", err);
    try {
      await ctx.reply("Не удалось показать выбор целей.");
    } catch {
      /* ignore */
    }
  }
}

export async function sendTimePreference(
  ctx: RecommendationContext,
  mode: PromptMode = "new"
): Promise<void> {
  const temp = ensureTemp(ctx);
  if (!temp.timeSelection) {
    temp.timeSelection = ensureProfile(ctx).preferredTimes ?? [];
  }
  const text = timeSelectionText(temp.timeSelection);
  const keyboard = buildTimePreferenceKeyboard(temp.timeSelection);
  try {
    if (mode === "edit" && ctx.callbackQuery?.message) {
      await ctx.editMessageText(text, keyboard);
    } else {
      await sendPromptMessage(ctx, text, keyboard);
    }
  } catch (err) {
    console.error("sendTimePreference error:", err);
    try {
      await ctx.reply("Не удалось показать выбор времени.");
    } catch {
      /* ignore */
    }
  }
}

export function currentFitnessLabel(index: number): string {
  return fitnessLevelLabelsRu[fitnessOrder[index] ?? "medium"];
}
