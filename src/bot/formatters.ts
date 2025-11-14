import type {
  RecommendationResult,
  TrainingFormat,
  GoalTag,
  RecommendationReason,
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

// RegExp intentionally escapes MarkdownV2 special characters. eslint may flag some escapes
// but they are required for the character class to be safe across engines.
/* eslint-disable no-useless-escape */
export function escapeMarkdown(text: string): string {
  return text.replace(/([_\-*\[\]()~`>#+=|{}.!\\])/g, "\\$1");
}
/* eslint-enable no-useless-escape */

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
  return `Предпочтительные форматы занятий: ${labels}. Нажмите "Готово", когда закончите.`;
}

export function goalSelectionText(selection: GoalTag[]): string {
  if (!selection.length) {
    return "Выберите ваши цели в тренировках. Можно отметить несколько вариантов.";
  }
  const labels = selection.map((tag) => goalTagLabels[tag]).join(", ");
  return `Вы выбрали: ${labels}. Добавьте или снимите отметку и нажмите "Готово".`;
}

export function timeSelectionText(
  selection: ("morning" | "afternoon" | "evening" | "weekend")[]
): string {
  if (!selection || selection.length === 0) {
    return "Предпочтительное время: не важно. Выберите удобные слоты.";
  }
  const labels = selection
    .map((t) => {
      if (t === "morning") return "утро";
      if (t === "afternoon") return "день";
      if (t === "evening") return "вечер";
      if (t === "weekend") return "выходные";
      return t;
    })
    .join(", ");
  return `Предпочтительное время занятий: ${labels}. Нажмите "Готово", когда закончите.`;
}

function describeReason(reason: RecommendationReason): string {
  switch (reason.kind) {
    case "goal-match": {
      const focusLabels = reason.tags.map((tag) => goalTagLabels[tag] ?? tag);
      return `Соответствует целям: ${focusLabels.join(", ")}.`;
    }
    case "format-aligned": {
      const preferredLabels = reason.preferred
        .map((format) => formatLabelsRu[format])
        .join(", ");
      return `Формат (${
        formatLabelsRu[reason.format]
      }) совпадает с предпочтениями (${preferredLabels}).`;
    }
    case "format-mismatch": {
      const preferredLabels = reason.preferred
        .map((format) => formatLabelsRu[format])
        .join(", ");
      return `Формат направления (${
        formatLabelsRu[reason.format]
      }) отличается от предпочтений (${preferredLabels}), но может подойти.`;
    }
    case "fitness-balanced": {
      return `Интенсивность (${
        intensityLabelsRu[reason.intensity]
      }) соответствует вашему уровню (${
        fitnessLevelLabelsRu[reason.profileLevel]
      }).`;
    }
    case "fitness-progressive": {
      return `Интенсивность (${
        intensityLabelsRu[reason.intensity]
      }) немного выше уровня (${
        fitnessLevelLabelsRu[reason.profileLevel]
      }) и поможет прогрессировать.`;
    }
    case "fitness-gap": {
      return `Интенсивность (${
        intensityLabelsRu[reason.intensity]
      }) значительно выше текущего уровня (${
        fitnessLevelLabelsRu[reason.profileLevel]
      }), потребуется адаптация.`;
    }
    case "competition-path": {
      return "Программа включает путь к участию в соревнованиях.";
    }
    case "extra-benefits": {
      return `Дополнительные плюсы: ${reason.benefits.join(", ")}.`;
    }
    case "catalog-reference": {
      return reason.note;
    }
    default:
      return "";
  }
}

function describeReasons(reasons: RecommendationReason[]): string[] {
  return reasons
    .map(describeReason)
    .filter((text): text is string => Boolean(text));
}

export function renderRecommendationSummary(
  position: number,
  recommendation: RecommendationResult
): string {
  const { section, matchedFocus, reasons } = recommendation;
  const header = `*${escapeMarkdown(`${position}. ${section.title}`)}*`;
  const focusLabels = matchedFocus.map((tag) => goalTagLabels[tag] ?? tag);
  const focusLineRaw = focusLabels.length
    ? `Цели: ${focusLabels.join(", ")}`
    : "Цели: общий профиль";
  const formatLineRaw = `Формат: ${
    formatLabelsRu[section.format]
  }, интенсивность: ${intensityLabelsRu[section.intensity]}`;
  const reasonStrings = describeReasons(reasons);
  const reasonLineRaw = reasonStrings.length
    ? `Почему: ${reasonStrings[0]}`
    : "";

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
  const { section, matchedFocus, reasons } = recommendation;
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
  const reasonStrings = describeReasons(reasons);
  const reasonLineRaw = reasonStrings.length
    ? `Почему: ${reasonStrings.join(" ")}`
    : "";

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
