import { Scenes } from "telegraf";
import { fallbackSection, recommendSections } from "../../recommendation.js";
import type {
  GoalTag,
  TrainingFormat,
  UserProfile,
  RecommendationResult,
} from "../../types.js";
import {
  AGE_DEFAULT,
  AGE_MAX,
  AGE_MIN,
  fitnessLevelLabelsRu,
  fitnessOrder,
} from "../constants.js";
import {
  buildCompletionKeyboard,
  buildAgeKeyboard,
  buildFitnessKeyboard,
  buildFormatKeyboard,
  buildGoalKeyboard,
  buildRecommendationKeyboard,
  competitionKeyboard,
  contactKeyboard,
  genderKeyboard,
} from "../keyboards.js";
import {
  buildAgeSliderText,
  buildFitnessSliderText,
  formatSelectionText,
  goalSelectionText,
  renderRecommendationSummary,
} from "../formatters.js";
import {
  DataCallbackQuery,
  RecommendationContext,
  RecommendationSession,
  ensureProfile,
  ensureTemp,
} from "../session.js";

function clampAge(age: number): number {
  return Math.min(AGE_MAX, Math.max(AGE_MIN, age));
}

async function sendAgeSlider(
  ctx: RecommendationContext,
  mode: "new" | "edit" = "new"
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

async function sendFitnessSlider(
  ctx: RecommendationContext,
  mode: "new" | "edit" = "new"
): Promise<void> {
  const temp = ensureTemp(ctx);
  const profile = ensureProfile(ctx);
  if (temp.fitnessIndex === undefined) {
    const initialLevel = profile.fitnessLevel ?? "medium";
    const initialIndex = Math.max(fitnessOrder.indexOf(initialLevel), 1);
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

async function sendFormatPrompt(
  ctx: RecommendationContext,
  mode: "new" | "edit" = "new"
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

async function sendGoalPrompt(
  ctx: RecommendationContext,
  mode: "new" | "edit" = "new"
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

function parseAgeDelta(payload: string): number | null {
  const value = Number(payload);
  return Number.isNaN(value) ? null : value;
}

type ReplyExtra = Parameters<RecommendationContext["reply"]>[1];

async function cleanupPromptMessage(ctx: RecommendationContext): Promise<void> {
  const temp = ensureTemp(ctx);
  const { promptMessageId, promptChatId } = temp;
  if (promptMessageId === undefined || promptChatId === undefined) {
    return;
  }
  try {
    await ctx.telegram.deleteMessage(promptChatId, promptMessageId);
  } catch (err) {
    // игнорируем ошибки удаления: сообщение могло быть удалено ранее
    console.error("cleanupPromptMessage delete error:", err);
  }
  temp.promptMessageId = undefined;
  temp.promptChatId = undefined;
}

async function sendPromptMessage(
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

async function sendTransientMessage(
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

// Добавим safeStep — обёртку для шагов сцены, чтобы логировать ошибку и корректно завершать сцену
function safeStep(step: any) {
  return async (ctx: RecommendationContext, ...rest: any[]) => {
    try {
      return await step(ctx, ...rest);
    } catch (err) {
      console.error("Scene step error:", err);
      try {
        await ctx.reply("Произошла внутренняя ошибка. Попробуйте позже.");
      } catch {
        // ignore
      }
      try {
        return ctx.scene.leave();
      } catch {
        // ignore
      }
    }
  };
}

export const onboardingScene = new Scenes.WizardScene<RecommendationContext>(
  "onboarding",
  safeStep(async (ctx: RecommendationContext) => {
    const session = ctx.session as RecommendationSession;
    session.profile = {};
    session.temp = {};
    await ctx.reply(
      "Здравствуйте! Я помогу подобрать подходящую спортивную секцию БГУИР."
    );
    await sendAgeSlider(ctx, "new");
    return ctx.wizard.next();
  }),
  safeStep(async (ctx: RecommendationContext) => {
    if (ctx.updateType !== "callback_query") {
      if (ctx.message && "text" in ctx.message) {
        await sendTransientMessage(
          ctx,
          "Пожалуйста, используйте кнопки ниже для выбора возраста."
        );
      }
      return;
    }
    const callback = ctx.callbackQuery as DataCallbackQuery | undefined;
    const data = callback?.data;
    if (!data || !data.startsWith("age:")) {
      await ctx.answerCbQuery?.();
      return;
    }
    const action = data.split(":")[1];
    const temp = ensureTemp(ctx);
    if (temp.ageValue === undefined) {
      temp.ageValue = AGE_DEFAULT;
    }
    if (action === "done") {
      const age = clampAge(temp.ageValue);
      ensureProfile(ctx).age = age;
      await ctx.answerCbQuery?.(`Возраст сохранен: ${age} лет`);
      if (callback?.message) {
        await ctx
          .deleteMessage(callback.message.message_id)
          .catch(() => undefined);
      }
      temp.promptMessageId = undefined;
      temp.promptChatId = undefined;
      await sendPromptMessage(ctx, "Укажите пол:", genderKeyboard);
      return ctx.wizard.next();
    }
    const delta = parseAgeDelta(action);
    if (delta === null) {
      await ctx.answerCbQuery?.();
      return;
    }
    temp.ageValue = clampAge((temp.ageValue ?? AGE_DEFAULT) + delta);
    await ctx.answerCbQuery?.(`Возраст: ${temp.ageValue} лет`);
    await sendAgeSlider(ctx, "edit");
  }),
  safeStep(async (ctx: RecommendationContext) => {
    if (ctx.updateType !== "callback_query") {
      if (ctx.message && "text" in ctx.message) {
        await sendTransientMessage(
          ctx,
          "Пожалуйста, выберите вариант с помощью кнопок ниже."
        );
      }
      return;
    }
    const callback = ctx.callbackQuery as DataCallbackQuery | undefined;
    const data = callback?.data;
    if (!data || !data.startsWith("gender:")) {
      await ctx.answerCbQuery?.();
      return;
    }
    const value = data.split(":")[1];
    const profile = ensureProfile(ctx);
    if (value === "male") {
      profile.gender = "male";
    } else if (value === "female") {
      profile.gender = "female";
    } else {
      profile.gender = "unspecified";
    }
    const label =
      value === "male"
        ? "Мужской"
        : value === "female"
        ? "Женский"
        : "Без указания";
    await ctx.answerCbQuery?.(`Выбрано: ${label}`);
    if (callback?.message) {
      await ctx
        .deleteMessage(callback.message.message_id)
        .catch(() => undefined);
    }
    const tempState = ensureTemp(ctx);
    tempState.promptMessageId = undefined;
    tempState.promptChatId = undefined;
    await sendFitnessSlider(ctx, "new");
    return ctx.wizard.next();
  }),
  safeStep(async (ctx: RecommendationContext) => {
    if (ctx.updateType !== "callback_query") {
      if (ctx.message && "text" in ctx.message) {
        await sendTransientMessage(
          ctx,
          "Используйте кнопки ниже, чтобы настроить уровень."
        );
      }
      return;
    }
    const callback = ctx.callbackQuery as DataCallbackQuery | undefined;
    const data = callback?.data;
    const temp = ensureTemp(ctx);
    if (temp.fitnessIndex === undefined) {
      temp.fitnessIndex = 1;
    }
    if (!data) {
      await ctx.answerCbQuery?.();
      return;
    }
    if (data === "fitness_prev") {
      temp.fitnessIndex = Math.max(0, temp.fitnessIndex - 1);
      await ctx.answerCbQuery?.();
      await sendFitnessSlider(ctx, "edit");
      return;
    }
    if (data === "fitness_next") {
      temp.fitnessIndex = Math.min(
        fitnessOrder.length - 1,
        temp.fitnessIndex + 1
      );
      await ctx.answerCbQuery?.();
      await sendFitnessSlider(ctx, "edit");
      return;
    }
    if (data === "fitness_label") {
      const label = fitnessLevelLabelsRu[fitnessOrder[temp.fitnessIndex]];
      await ctx.answerCbQuery?.(`Текущий выбор: ${label}`);
      return;
    }
    if (data === "fitness_done") {
      const profile = ensureProfile(ctx);
      const level = fitnessOrder[temp.fitnessIndex] ?? "medium";
      profile.fitnessLevel = level;
      await ctx.answerCbQuery?.("Уровень сохранен.");
      if (callback?.message) {
        await ctx
          .deleteMessage(callback.message.message_id)
          .catch(() => undefined);
      }
      temp.promptMessageId = undefined;
      temp.promptChatId = undefined;
      await sendFormatPrompt(ctx, "new");
      return ctx.wizard.next();
    }
    await ctx.answerCbQuery?.();
  }),
  safeStep(async (ctx: RecommendationContext) => {
    if (ctx.updateType !== "callback_query") {
      if (ctx.message && "text" in ctx.message) {
        await sendTransientMessage(ctx, "Выберите форматы занятий кнопками.");
      }
      return;
    }
    const callback = ctx.callbackQuery as DataCallbackQuery | undefined;
    const data = callback?.data;
    if (!data || !data.startsWith("format:")) {
      await ctx.answerCbQuery?.();
      return;
    }
    const temp = ensureTemp(ctx);
    if (!temp.formatSelection) {
      temp.formatSelection = [];
    }
    const action = data.split(":")[1];
    if (action === "any") {
      temp.formatSelection = [];
      await ctx.answerCbQuery?.("Предпочтение сброшено.");
      await sendFormatPrompt(ctx, "edit");
      return;
    }
    if (action === "done") {
      ensureProfile(ctx).preferredFormats = temp.formatSelection;
      await ctx.answerCbQuery?.("Предпочтения сохранены.");
      if (callback?.message) {
        await ctx
          .deleteMessage(callback.message.message_id)
          .catch(() => undefined);
      }
      temp.promptMessageId = undefined;
      temp.promptChatId = undefined;
      await sendGoalPrompt(ctx, "new");
      return ctx.wizard.next();
    }
    const format = action as TrainingFormat;
    if (temp.formatSelection.includes(format)) {
      temp.formatSelection = temp.formatSelection.filter(
        (item) => item !== format
      );
      await ctx.answerCbQuery?.("Удалено из списка.");
    } else {
      temp.formatSelection.push(format);
      await ctx.answerCbQuery?.("Добавлено в список.");
    }
    await sendFormatPrompt(ctx, "edit");
  }),
  safeStep(async (ctx: RecommendationContext) => {
    if (ctx.updateType !== "callback_query") {
      if (ctx.message && "text" in ctx.message) {
        await sendTransientMessage(
          ctx,
          "Используйте кнопки для отметки целей."
        );
      }
      return;
    }
    const callback = ctx.callbackQuery as DataCallbackQuery | undefined;
    const data = callback?.data;
    if (!data || !data.startsWith("goal:")) {
      await ctx.answerCbQuery?.();
      return;
    }
    const temp = ensureTemp(ctx);
    if (!temp.goalSelection) {
      temp.goalSelection = [];
    }
    const action = data.split(":")[1] as string;
    if (action === "done") {
      if (!temp.goalSelection.length) {
        await ctx.answerCbQuery?.("Выберите хотя бы одну цель.", {
          show_alert: true,
        });
        return;
      }
      ensureProfile(ctx).desiredGoals = temp.goalSelection;
      await ctx.answerCbQuery?.("Цели сохранены.");
      if (callback?.message) {
        await ctx
          .deleteMessage(callback.message.message_id)
          .catch(() => undefined);
      }
      temp.promptMessageId = undefined;
      temp.promptChatId = undefined;
      await sendPromptMessage(
        ctx,
        "Следует ли избегать контактных видов спорта?",
        contactKeyboard
      );
      return ctx.wizard.next();
    }
    if (action === "clear") {
      temp.goalSelection = [];
      await ctx.answerCbQuery?.("Выбор очищен.");
      await sendGoalPrompt(ctx, "edit");
      return;
    }
    const tag = action as GoalTag;
    if (temp.goalSelection.includes(tag)) {
      temp.goalSelection = temp.goalSelection.filter((item) => item !== tag);
      await ctx.answerCbQuery?.("Цель снята.");
    } else {
      temp.goalSelection.push(tag);
      await ctx.answerCbQuery?.("Цель добавлена.");
    }
    await sendGoalPrompt(ctx, "edit");
  }),
  safeStep(async (ctx: RecommendationContext) => {
    if (ctx.updateType !== "callback_query") {
      if (ctx.message && "text" in ctx.message) {
        await sendTransientMessage(
          ctx,
          "Пожалуйста, выберите кнопку 'Да' или 'Нет'."
        );
      }
      return;
    }
    const callback = ctx.callbackQuery as DataCallbackQuery | undefined;
    const data = callback?.data;
    if (!data || !data.startsWith("contact:")) {
      await ctx.answerCbQuery?.();
      return;
    }
    const avoid = data.endsWith("yes");
    ensureProfile(ctx).avoidContact = avoid;
    await ctx.answerCbQuery?.(
      avoid ? "Будем избегать контакта." : "Контакт допустим."
    );
    if (callback?.message) {
      await ctx
        .deleteMessage(callback.message.message_id)
        .catch(() => undefined);
    }
    const tempState = ensureTemp(ctx);
    tempState.promptMessageId = undefined;
    tempState.promptChatId = undefined;
    await sendPromptMessage(
      ctx,
      "Интересна ли соревновательная подготовка?",
      competitionKeyboard
    );
    return ctx.wizard.next();
  }),
  safeStep(async (ctx: RecommendationContext) => {
    if (ctx.updateType !== "callback_query") {
      if (ctx.message && "text" in ctx.message) {
        await sendTransientMessage(
          ctx,
          "Пожалуйста, выберите кнопку 'Да' или 'Нет'."
        );
      }
      return;
    }
    const callback = ctx.callbackQuery as DataCallbackQuery | undefined;
    const data = callback?.data;
    if (!data || !data.startsWith("competition:")) {
      await ctx.answerCbQuery?.();
      return;
    }
    const interested = data.endsWith("yes");
    ensureProfile(ctx).interestedInCompetition = interested;
    await ctx.answerCbQuery?.(
      interested
        ? "Учтем интерес к соревнованиям."
        : "Сфокусируемся на общей подготовке."
    );
    if (callback?.message) {
      await ctx
        .deleteMessage(callback.message.message_id)
        .catch(() => undefined);
    }
    const tempState = ensureTemp(ctx);
    tempState.promptMessageId = undefined;
    tempState.promptChatId = undefined;

    const sessionProfile = ensureProfile(ctx);
    const profile: UserProfile = {
      age: sessionProfile.age ?? AGE_DEFAULT,
      gender: sessionProfile.gender ?? "unspecified",
      fitnessLevel: sessionProfile.fitnessLevel ?? "medium",
      preferredFormats: sessionProfile.preferredFormats ?? [],
      desiredGoals: sessionProfile.desiredGoals ?? [],
      avoidContact: sessionProfile.avoidContact ?? false,
      interestedInCompetition: sessionProfile.interestedInCompetition ?? false,
    };

    let recommendations: RecommendationResult[] = [];
    try {
      recommendations = recommendSections(profile, 3);
    } catch (err) {
      console.error("recommendSections error:", err);
    }
    const temp = ensureTemp(ctx);
    temp.recommendations = recommendations;

    if (!recommendations.length) {
      let fallback: RecommendationResult | null = null;
      try {
        fallback = fallbackSection(profile);
      } catch (err) {
        console.error("fallbackSection error:", err);
      }
      if (fallback) {
        temp.recommendations = [fallback];
        const summary = renderRecommendationSummary(1, fallback);
        await ctx.replyWithMarkdownV2(
          summary,
          buildRecommendationKeyboard(fallback.section.id)
        );
      } else {
        await ctx.reply(
          "Не удалось подобрать точное совпадение. Попробуйте изменить ответы командой /start."
        );
      }
    } else {
      for (const [index, item] of recommendations.entries()) {
        const summary = renderRecommendationSummary(index + 1, item);
        await ctx.replyWithMarkdownV2(
          summary,
          buildRecommendationKeyboard(item.section.id)
        );
      }
    }

    await ctx.reply(
      "Команда /sections покажет все направления. Используйте кнопки ниже для быстрого доступа.",
      buildCompletionKeyboard()
    );

    return ctx.scene.leave();
  })
);
