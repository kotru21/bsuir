import type { UserProfile } from "../types.js";
import type { TrainingFormat, GoalTag } from "../types.js";
import { AGE_DEFAULT } from "../domain/profileDefaults.js";

export interface ProfileDraft extends Partial<UserProfile> {
  preferredFormats?: TrainingFormat[];
  desiredGoals?: GoalTag[];
}

export function assembleUserProfile(draft: ProfileDraft): UserProfile {
  return {
    age: draft.age ?? AGE_DEFAULT,
    gender: draft.gender ?? "unspecified",
    fitnessLevel: draft.fitnessLevel ?? "medium",
    preferredFormats: [...(draft.preferredFormats ?? [])],
    desiredGoals: [...(draft.desiredGoals ?? [])],
    avoidContact: draft.avoidContact ?? false,
    interestedInCompetition: draft.interestedInCompetition ?? false,
  };
}
