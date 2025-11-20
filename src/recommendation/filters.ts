import type { SportSection, UserProfile } from "../types.js";
import { clamp01 } from "./vectorSpaces.js";

export function isContactCompatible(
  section: SportSection,
  profile: UserProfile
): boolean {
  const tolerance = clamp01(
    profile.contactTolerance ?? (profile.avoidContact ? 0 : 1)
  );
  if (tolerance <= 0 && section.contactLevel !== "nonContact") {
    return false;
  }
  if (tolerance < 0.4 && section.contactLevel === "fullContact") {
    return false;
  }
  return true;
}

export function applyStrictFilters(
  section: SportSection,
  profile: UserProfile
): boolean {
  if (profile.avoidContact && section.contactLevel !== "nonContact") {
    return false;
  }

  if (profile.preferredFormats?.length > 0) {
    if (!profile.preferredFormats.includes(section.format)) {
      return false;
    }
  }

  return true;
}
