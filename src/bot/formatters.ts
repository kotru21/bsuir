import type {
  RecommendationResult,
  TrainingFormat,
  GoalTag,
} from "../types.js";
import {
  AGE_MAX,
  AGE_MIN,
  fitnessLevelLabelsRu,
  fitnessOrder,
  formatLabelsRu,
  goalTagLabels,
  intensityLabelsRu,
} from "./constants.js";

export function escapeMarkdown(text: string): string {
  return text.replace(/([_\-*\[\]()~`>#+=|{}.!\\])/g, "\\$1");
}

export function buildAgeSliderText(age: number): string {
  return [
    "Укажите ваш возраст.",
    `Текущий выбор: ${age} лет`,
    `Диапазон: ${AGE_MIN}-${AGE_MAX} лет`,
    "Используйте кнопки ниже, чтобы изменить значение.",
  ].join("\n");
}

export function buildFitnessSliderText(index: number): string {
  const notation = fitnessOrder
    .map((_, idx) => (idx === index ? "[X]" : "[ ]"))
    .join("-");
  const level = fitnessLevelLabelsRu[fitnessOrder[index] ?? "medium"];
  return [
    "Оцените текущий уровень физической подготовки.",
    notation,
    `Текущий выбор: ${level}`,
    "Используйте стрелки ниже для изменения уровня.",
  ].join("\n");
}

export function formatSelectionText(selection: TrainingFormat[]): string {
  if (selection.length === 0) {
    return "Предпочтительные форматы занятий: не важно. Выберите варианты кнопками ниже.";
  }
  const labels = selection.map((format) => formatLabelsRu[format]).join(", ");
  return `Предпочтительные форматы занятий: ${labels}. Нажмите \"Готово\", когда закончите.`;
}

export function goalSelectionText(selection: GoalTag[]): string {
  if (!selection.length) {
    return "Выберите ваши цели в тренировках. Можно отметить несколько вариантов.";
  }
  const labels = selection.map((tag) => goalTagLabels[tag]).join(", ");
  return `Вы выбрали: ${labels}. Добавьте или снимите отметку и нажмите \"Готово\".`;
}

export function renderRecommendationSummary(
  position: number,
  recommendation: RecommendationResult
): string {
  const { section, matchedFocus, reason } = recommendation;
  const header = `*${escapeMarkdown(`${position}. ${section.title}`)}*`;
  const focusLabels = matchedFocus.map((tag) => goalTagLabels[tag] ?? tag);
  const focusLineRaw = focusLabels.length
    ? `Цели: ${focusLabels.join(", ")}`
    : "Цели: общий профиль";
  const formatLineRaw = `Формат: ${
    formatLabelsRu[section.format]
  }, интенсивность: ${intensityLabelsRu[section.intensity]}`;
  const reasonLineRaw = reason.length ? `Почему: ${reason[0]}` : "";

  return [
    header,
    escapeMarkdown(focusLineRaw),
    escapeMarkdown(formatLineRaw),
    reasonLineRaw ? escapeMarkdown(reasonLineRaw) : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function renderRecommendationDetail(
  position: number,
  recommendation: RecommendationResult
): string {
  const { section, matchedFocus, reason } = recommendation;
  const focusLabels = matchedFocus.map((tag) => goalTagLabels[tag] ?? tag);
  const focusLineRaw = focusLabels.length
    ? `Совпадение по целям: ${focusLabels.join(", ")}`
    : "Совпадение по целям: общий профиль";
  const formatLineRaw = `Формат: ${
    formatLabelsRu[section.format]
  } | Интенсивность: ${intensityLabelsRu[section.intensity]}`;
  const extraRaw = section.extraBenefits?.length
    ? `Дополнительно: ${section.extraBenefits.join(", ")}`
    : "";
  const timelineRaw = `Ожидаемые результаты: ${section.expectedResults.shortTerm} / ${section.expectedResults.midTerm} / ${section.expectedResults.longTerm}`;
  const reasonLineRaw = reason.length ? `Почему: ${reason.join(" ")}` : "";

  return [
    `*${escapeMarkdown(`${position}. ${section.title}`)}*`,
    escapeMarkdown(section.summary),
    escapeMarkdown(focusLineRaw),
    escapeMarkdown(formatLineRaw),
    extraRaw ? escapeMarkdown(extraRaw) : "",
    escapeMarkdown(timelineRaw),
    reasonLineRaw ? escapeMarkdown(reasonLineRaw) : "",
  ]
    .filter(Boolean)
    .join("\n");
}
