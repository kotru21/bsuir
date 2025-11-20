import { getPrismaClient } from "../infrastructure/prismaClient.js";
import type {
  ContactLevel,
  FitnessLevel,
  GoalTag,
  SectionTimeline,
  SimilarityVector,
  SportSection,
  TrainingFormat,
} from "../types.js";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let sectionsCache: SportSection[] | null = null;
let cacheTimestamp = 0;

async function fetchSections(): Promise<SportSection[]> {
  const prisma = getPrismaClient();
  try {
    const sections = await prisma.sportSection.findMany();
    return sections.map((section) => ({
      ...(section as unknown as SportSection),
      focus: section.focus as GoalTag[],
      format: section.format as TrainingFormat,
      contactLevel: section.contactLevel as ContactLevel,
      intensity: section.intensity as FitnessLevel,
      recommendedFor: section.recommendedFor as unknown as Array<{
        fitnessLevel?: FitnessLevel;
        note: string;
      }>,
      expectedResults: section.expectedResults as unknown as SectionTimeline,
      similarityVector: section.similarityVector as unknown as SimilarityVector,
      prerequisites: section.prerequisites ?? undefined,
      imagePath: section.imagePath ?? undefined,
      locationHint: section.locationHint ?? undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch sections from DB", error);
    return [];
  }
}

export async function getAllSections(): Promise<SportSection[]> {
  const now = Date.now();
  if (sectionsCache && now - cacheTimestamp < CACHE_TTL_MS) {
    return sectionsCache;
  }

  const sections = await fetchSections();
  sectionsCache = sections;
  cacheTimestamp = now;
  return sections;
}

export function invalidateSectionsCache(): void {
  sectionsCache = null;
  cacheTimestamp = 0;
}
