import { Scenes } from "telegraf";
import type { RecommendationContext } from "../session.js";
import { wrapSceneStep } from "../utils/safeHandler.js";
import {
  introStep,
  ageSelectionStep,
  genderStep,
  fitnessStep,
  formatStep,
  timePreferenceStep,
  goalStep,
  contactPreferenceStep,
  competitionInterestStep,
} from "./onboarding/steps/index.js";
import { clampAge, parseAgeDelta } from "./onboarding/helpers.js";

export { clampAge, parseAgeDelta };

const steps = [
  wrapSceneStep(introStep),
  wrapSceneStep(ageSelectionStep),
  wrapSceneStep(genderStep),
  wrapSceneStep(fitnessStep),
  wrapSceneStep(formatStep),
  wrapSceneStep(timePreferenceStep),
  wrapSceneStep(goalStep),
  wrapSceneStep(contactPreferenceStep),
  wrapSceneStep(competitionInterestStep),
];

export const onboardingScene = new Scenes.WizardScene<RecommendationContext>(
  "onboarding",
  ...steps
);
