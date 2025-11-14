import { Markup } from "telegraf";
import type { GoalTag, TrainingFormat } from "../types.js";
import {
  fitnessLevelLabelsRu,
  fitnessOrder,
  goalOptions,
  goalTagLabels,
} from "./constants.js";

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export const genderKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback("Мужской", "gender:male"),
    Markup.button.callback("Женский", "gender:female"),
  ],
  [Markup.button.callback("Пропустить", "gender:unspecified")],
]);

export const contactKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback("Да", "contact:yes"),
    Markup.button.callback("Нет", "contact:no"),
  ],
]);

export const competitionKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback("Да", "competition:yes"),
    Markup.button.callback("Нет", "competition:no"),
  ],
]);

export function buildAgeKeyboard(
  age: number
): ReturnType<typeof Markup.inlineKeyboard> {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("−5", "age:-5"),
      Markup.button.callback("−1", "age:-1"),
      Markup.button.callback("+1", "age:+1"),
      Markup.button.callback("+5", "age:+5"),
    ],
    [Markup.button.callback(`Готово (${age} лет)`, "age:done")],
  ]);
}

export function buildFitnessKeyboard(
  index: number
): ReturnType<typeof Markup.inlineKeyboard> {
  const label = fitnessLevelLabelsRu[fitnessOrder[index] ?? "medium"];
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("⬅️", "fitness_prev"),
      Markup.button.callback(`Выбор: ${label}`, "fitness_label"),
      Markup.button.callback("➡️", "fitness_next"),
    ],
    [Markup.button.callback("Готово", "fitness_done")],
  ]);
}

export function buildFormatKeyboard(
  selection: TrainingFormat[]
): ReturnType<typeof Markup.inlineKeyboard> {
  const isSelected = (format: TrainingFormat) => selection.includes(format);
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        `${isSelected("individual") ? "✅" : "▫️"} Индивидуальные`,
        "format:individual"
      ),
      Markup.button.callback(
        `${isSelected("group") ? "✅" : "▫️"} Групповые`,
        "format:group"
      ),
    ],
    [
      Markup.button.callback(
        `${isSelected("mixed") ? "✅" : "▫️"} Смешанные`,
        "format:mixed"
      ),
      Markup.button.callback(
        `${selection.length === 0 ? "✅" : "▫️"} Не важно`,
        "format:any"
      ),
    ],
    [Markup.button.callback("Готово", "format:done")],
  ]);
}

export function buildGoalKeyboard(
  selection: GoalTag[]
): ReturnType<typeof Markup.inlineKeyboard> {
  const chunks = chunkArray(Object.entries(goalOptions), 2);
  const rows = chunks.map((chunk) =>
    chunk.map(([, { tag, label }]) =>
      Markup.button.callback(
        `${selection.includes(tag) ? "✅" : "▫️"} ${label}`,
        `goal:${tag}`
      )
    )
  );
  rows.push([
    Markup.button.callback("Очистить", "goal:clear"),
    Markup.button.callback("Готово", "goal:done"),
  ]);
  return Markup.inlineKeyboard(rows);
}

export function buildGoalPriorityKeyboard(
  selection: GoalTag[],
  prioritized: GoalTag[]
): ReturnType<typeof Markup.inlineKeyboard> {
  if (!selection.length) {
    return Markup.inlineKeyboard([
      [Markup.button.callback("Пропустить", "goalpr:skip")],
    ]);
  }
  const entries = selection.map((tag) => ({
    tag,
    label:
      goalTagLabels[tag] ??
      Object.values(goalOptions).find((option) => option.tag === tag)?.label ??
      tag,
  }));
  const rows = chunkArray(entries, 2).map((chunk) =>
    chunk.map(({ tag, label }) =>
      Markup.button.callback(
        `${prioritized.includes(tag) ? "⭐" : "▫️"} ${label}`,
        `goalpr:${tag}`
      )
    )
  );
  rows.push([
    Markup.button.callback("Очистить", "goalpr:clear"),
    Markup.button.callback("Готово", "goalpr:done"),
  ]);
  rows.push([Markup.button.callback("Пропустить", "goalpr:skip")]);
  return Markup.inlineKeyboard(rows);
}

export function buildIntensityComfortKeyboard(): ReturnType<
  typeof Markup.inlineKeyboard
> {
  return Markup.inlineKeyboard([
    [Markup.button.callback("Бережно", "intensitypref:steady")],
    [Markup.button.callback("Сбалансировано", "intensitypref:balanced")],
    [Markup.button.callback("Готов к интенсивности", "intensitypref:push")],
  ]);
}

export function buildRecommendationKeyboard(
  sectionId: string
): ReturnType<typeof Markup.inlineKeyboard> {
  return Markup.inlineKeyboard([
    [Markup.button.callback("Подробнее", `rec:${sectionId}`)],
  ]);
}

export function buildRecommendationCarouselKeyboard(
  index: number,
  total: number,
  sectionId: string
): ReturnType<typeof Markup.inlineKeyboard> {
  if (total <= 1) {
    return buildRecommendationKeyboard(sectionId);
  }
  const prevIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("\u23ee\ufe0f", `wizardrec:${prevIndex}`),
      Markup.button.callback(`${index + 1}/${total}`, "wizardrec:noop"),
      Markup.button.callback("\u23ed\ufe0f", `wizardrec:${nextIndex}`),
    ],
    [Markup.button.callback("Подробнее", `rec:${sectionId}`)],
  ]);
}

export function buildSectionsKeyboard(
  index: number,
  total: number,
  sectionId: string
): ReturnType<typeof Markup.inlineKeyboard> {
  const prevIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("\u23ee\ufe0f", `sections:${prevIndex}`),
      Markup.button.callback(`${index + 1}/${total}`, `sections:noop`),
      Markup.button.callback("\u23ed\ufe0f", `sections:${nextIndex}`),
    ],
    [Markup.button.callback("Подробнее", `rec:${sectionId}`)],
  ]);
}
export function buildCompletionKeyboard(): ReturnType<typeof Markup.keyboard> {
  return Markup.keyboard([["/start", "/sections"]])
    .oneTime()
    .resize();
}
