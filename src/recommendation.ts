import type {
  RecommendationResult,
  SportSection,
  UserProfile,
} from "./types.js";
import { applyStrictFilters } from "./recommendation/filters.js";
import { getAllSections } from "./recommendation/sectionRepository.js";
import { scoreSections } from "./recommendation/similarity.js";

async function loadFilteredSections(
  profile: UserProfile
): Promise<SportSection[]> {
  const allSections = await getAllSections();
  return allSections.filter((section) => applyStrictFilters(section, profile));
}

export async function recommendSections(
  profile: UserProfile,
  limit = 3
): Promise<RecommendationResult[]> {
  if (!profile || typeof profile !== "object") {
    console.error("recommendSections: invalid profile", profile);
    return [];
  }

  try {
    const filtered = await loadFilteredSections(profile);
    const scored = scoreSections(filtered, profile);
    return scored.slice(0, limit);
  } catch (err) {
    console.error("recommendSections error:", err);
    return [];
  }
}

export async function fallbackSection(
  profile: UserProfile
): Promise<RecommendationResult | null> {
  if (!profile || typeof profile !== "object") {
    console.error("fallbackSection: invalid profile", profile);
    return null;
  }

  try {
    const filtered = await loadFilteredSections(profile);
    const scored = scoreSections(filtered, profile, true);
    return scored[0] ?? null;
  } catch (err) {
    console.error("fallbackSection error:", err);
    return null;
  }
}

export async function listAllSections(): Promise<SportSection[]> {
  try {
    return await getAllSections();
  } catch (err) {
    console.error("listAllSections error:", err);
    return [];
  }
}
