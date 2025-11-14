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

function describeReason(reason: RecommendationReason): string {
  switch (reason.kind) {
    case "similarity-goal": {
      const focusLabels = reason.tags.map((tag) => goalTagLabels[tag] ?? tag);
      return `Совпадает с ключевыми целями: ${focusLabels.join(", ")}.`;
    }
    case "similarity-format": {
      const labels = reason.formats.map((format) => formatLabelsRu[format]);
      return `Формат (${labels.join(", ")}) соответствует вашему запросу.`;
    }
    case "similarity-intensity": {
      return `Интенсивность (${
        intensityLabelsRu[reason.sectionLevel]
      }) согласуется с вашим уровнем (${
        fitnessLevelLabelsRu[reason.profileLevel]
      }).`;
    }
    case "competition-alignment": {
      return "Есть возможность двигаться к соревнованиям.";
    }
    case "contact-compatibility": {
      return "Контактность секции соответствует вашим предпочтениям.";
    }
    case "vector-gap": {
      if (reason.dimension.startsWith("goal:")) {
        const tag = reason.dimension.split(":")[1] as GoalTag;
        return `Недостающее направление: ${goalTagLabels[tag] ?? tag}.`;
      }
      if (reason.dimension.startsWith("format:")) {
        const format = reason.dimension.split(":")[1] as TrainingFormat;
        return `Желаемый формат (${formatLabelsRu[format]}) пока не найден.`;
      }
      return "По одному из параметров нет точного совпадения.";
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

function resolveGoalLabels(
  recommendation: RecommendationResult,
  limit: number
): string[] {
  const goalReason = recommendation.reasons.find(
    (
      reason
    ): reason is Extract<RecommendationReason, { kind: "similarity-goal" }> =>
      reason.kind === "similarity-goal"
  );
  const tags = goalReason
    ? goalReason.tags.slice(0, limit)
    : recommendation.section.focus.slice(0, limit);
  return tags.map((tag) => goalTagLabels[tag] ?? tag);
}

function resolveFormatLabels(recommendation: RecommendationResult): string[] {
  const formatReason = recommendation.reasons.find(
    (
      reason
    ): reason is Extract<RecommendationReason, { kind: "similarity-format" }> =>
      reason.kind === "similarity-format"
  );
  const formats = formatReason?.formats ?? [recommendation.section.format];
  return formats.map((format) => formatLabelsRu[format]);
}

export function renderRecommendationSummary(
  position: number,
  recommendation: RecommendationResult
): string {
  const { section, reasons } = recommendation;
  const header = `*${escapeMarkdown(`${position}. ${section.title}`)}*`;
  const focusLabels = resolveGoalLabels(recommendation, 2);
  const focusLineRaw = focusLabels.length
    ? `Цели: ${focusLabels.join(", ")}`
    : "Цели: общий профиль";
  const formatLineRaw = `Формат: ${resolveFormatLabels(recommendation).join(
    ", "
  )}, интенсивность: ${intensityLabelsRu[section.intensity]}`;
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
  const { section, reasons } = recommendation;
  const focusLabels = resolveGoalLabels(recommendation, 3);
  const focusLineRaw = focusLabels.length
    ? `Совпадение по целям: ${focusLabels.join(", ")}`
    : "Совпадение по целям: общий профиль";
  const formatLineRaw = `Формат: ${resolveFormatLabels(recommendation).join(
    ", "
  )} | Интенсивность: ${intensityLabelsRu[section.intensity]}`;
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
