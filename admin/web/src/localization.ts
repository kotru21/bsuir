export type TrainingFormatKey = "individual" | "group" | "mixed";

export type GoalKey =
  | "strength"
  | "endurance"
  | "flexibility"
  | "teamwork"
  | "martialArts"
  | "ballSports"
  | "aquatic"
  | "dance"
  | "coordination"
  | "rehabilitation"
  | "weightManagement"
  | "aesthetics"
  | "competition";

export type FitnessLevelKey = "low" | "medium" | "high";

export type GenderKey = "male" | "female" | "unspecified";

const trainingFormatLabels: Record<TrainingFormatKey, string> = {
  individual: "Индивидуальный",
  group: "Групповой",
  mixed: "Смешанный",
};

const goalLabels: Record<GoalKey, string> = {
  strength: "Сила и мышцы",
  endurance: "Выносливость",
  flexibility: "Гибкость",
  teamwork: "Командные виды спорта",
  martialArts: "Единоборства",
  ballSports: "Техника владения мячом",
  aquatic: "Водные активности",
  dance: "Танцевальные направления",
  coordination: "Координация и ловкость",
  rehabilitation: "Здоровье и реабилитация",
  weightManagement: "Контроль веса",
  aesthetics: "Эстетика и пластика",
  competition: "Соревновательная подготовка",
};

const fitnessLevelLabels: Record<FitnessLevelKey, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

const genderLabels: Record<GenderKey, string> = {
  male: "Мужчины",
  female: "Женщины",
  unspecified: "Не указано",
};

const genderSingleLabels: Record<GenderKey, string> = {
  male: "Мужчина",
  female: "Женщина",
  unspecified: "Не указано",
};

export const GENDER_ORDER: GenderKey[] = ["male", "female", "unspecified"];

export function translateTrainingFormat(value: string): string {
  return trainingFormatLabels[value as TrainingFormatKey] ?? "Другой формат";
}

export function translateGoal(value: string): string {
  return goalLabels[value as GoalKey] ?? "Другая цель";
}

export function translateFitnessLevel(value: string): string {
  return fitnessLevelLabels[value as FitnessLevelKey] ?? value;
}

export function translateGenderPlural(value: string): string {
  return genderLabels[value as GenderKey] ?? value;
}

export function translateGenderSingle(value: string): string {
  return genderSingleLabels[value as GenderKey] ?? value;
}

export function mapRecordWithTranslation(
  source: Record<string, number>,
  translate: (key: string) => string,
  preferredOrder: string[] = []
): Record<string, number> {
  const result: Record<string, number> = {};
  const seen = new Set<string>();

  if (preferredOrder.length) {
    for (const rawKey of preferredOrder) {
      if (Object.prototype.hasOwnProperty.call(source, rawKey)) {
        const translatedKey = translate(rawKey);
        result[translatedKey] = source[rawKey];
        seen.add(rawKey);
      }
    }
  }

  for (const [rawKey, value] of Object.entries(source)) {
    if (seen.has(rawKey)) {
      continue;
    }
    const translatedKey = translate(rawKey);
    result[translatedKey] = value;
  }

  return result;
}

export function translateTimelineDate(value: string): string {
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return value;
  }
  const [year, month, day] = parts;
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
  }).format(date);
}
