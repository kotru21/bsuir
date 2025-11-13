import type { Scenes } from "telegraf";
import type {
  GoalTag,
  RecommendationResult,
  TrainingFormat,
  UserProfile,
} from "../types.js";

export interface TempState {
  ageValue?: number;
  fitnessIndex?: number;
  formatSelection?: TrainingFormat[];
  goalSelection?: GoalTag[];
  recommendations?: RecommendationResult[];
  recommendationIndex?: number;
  promptMessageId?: number;
  promptChatId?: number | string;
  aiSummary?: string;
  processingMessageId?: number;
}

export interface RecommendationSession extends Scenes.WizardSessionData {
  profile?: Partial<UserProfile>;
  temp?: TempState;
}

export type RecommendationContext = Scenes.WizardContext<RecommendationSession>;

export type DataCallbackQuery = Extract<
  NonNullable<RecommendationContext["callbackQuery"]>,
  { data: string }
>;

export function ensureProfile(
  ctx: RecommendationContext
): Partial<UserProfile> {
  const session = ctx.session as RecommendationSession;
  if (!session.profile) {
    session.profile = {};
  }
  return session.profile;
}

export function ensureTemp(ctx: RecommendationContext): TempState {
  const session = ctx.session as RecommendationSession;
  if (!session.temp) {
    session.temp = {};
  }
  return session.temp;
}
