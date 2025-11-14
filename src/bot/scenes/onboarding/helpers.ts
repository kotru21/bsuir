import { AGE_MAX, AGE_MIN, AGE_DEFAULT } from "../../constants.js";
import { ensureProfile, ensureTemp } from "../../session.js";
import type {
  RecommendationContext,
  RecommendationSession,
} from "../../session.js";

export function clampAge(age: number): number {
  return Math.min(AGE_MAX, Math.max(AGE_MIN, age));
}

export function parseAgeDelta(payload: string): number | null {
  const value = Number(payload);
  return Number.isNaN(value) ? null : value;
}

export function resetPromptState(ctx: RecommendationContext): void {
  const temp = ensureTemp(ctx);
  temp.promptChatId = undefined;
  temp.promptMessageId = undefined;
}

export function initializeSession(ctx: RecommendationContext): void {
  const session = ctx.session as RecommendationSession;
  session.profile = {};
  session.temp = {
    ageValue: AGE_DEFAULT,
    fitnessIndex: undefined,
    formatSelection: undefined,
    goalSelection: undefined,
    goalPrioritySelection: undefined,
    recommendations: undefined,
    promptMessageId: undefined,
    promptChatId: undefined,
  };
  ensureProfile(ctx);
  ensureTemp(ctx);
}
