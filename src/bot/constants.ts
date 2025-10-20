import type { FitnessLevel, GoalTag, TrainingFormat } from "../types.js";

export const AGE_MIN = 14;
export const AGE_MAX = 80;
export const AGE_DEFAULT = 20;

export const goalOptions: Record<string, { tag: GoalTag; label: string }> = {
  1: { tag: "strength", label: "Сила и мышцы" },
  2: { tag: "endurance", label: "Выносливость" },
  3: { tag: "flexibility", label: "Гибкость" },
  4: { tag: "teamwork", label: "Командные виды спорта" },
  5: { tag: "martialArts", label: "Единоборства" },
  6: { tag: "ballSports", label: "Техника владения мячом" },
  7: { tag: "aquatic", label: "Водные активности" },
  8: { tag: "dance", label: "Танцевальные направления" },
  9: { tag: "coordination", label: "Координация и ловкость" },
  10: { tag: "rehabilitation", label: "Здоровье и реабилитация" },
  11: { tag: "weightManagement", label: "Контроль веса" },
  12: { tag: "aesthetics", label: "Эстетика и пластика" },
  13: { tag: "competition", label: "Соревновательная подготовка" },
};

export const goalTagLabels: Record<GoalTag, string> = Object.values(
  goalOptions
).reduce((acc, { tag, label }) => {
  acc[tag] = label;
  return acc;
}, {} as Record<GoalTag, string>);

export const formatLabelsRu: Record<TrainingFormat, string> = {
  individual: "индивидуальный",
  group: "групповой",
  mixed: "смешанный",
};

export const intensityLabelsRu: Record<FitnessLevel, string> = {
  low: "низкая",
  medium: "средняя",
  high: "высокая",
};

export const fitnessLevelLabelsRu: Record<FitnessLevel, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

export const fitnessOrder: FitnessLevel[] = ["low", "medium", "high"];
