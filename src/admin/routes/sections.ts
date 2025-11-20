import { getPrismaClient } from "../../infrastructure/prismaClient.js";
import { invalidateSectionsCache } from "../../recommendation/sectionRepository.js";
import type { SportSection } from "../../types.js";
import type { AdminConfig } from "../config.js";
import type { AdminRouter } from "../http/types.js";
import { buildAdminApiPath } from "../http/pathUtils.js";

export async function registerSectionsRoutes(
  router: AdminRouter,
  options: { config: AdminConfig }
): Promise<void> {
  const prisma = getPrismaClient();
  const { config } = options;
  const sectionsPath = (suffix = "") =>
    buildAdminApiPath(config.basePath, `/sections${suffix}`);

  router.get(sectionsPath(""), async (ctx) => {
    await ctx.requireAdminAuth();
    try {
      const sections = await prisma.sportSection.findMany({
        orderBy: { title: "asc" },
      });
      return ctx.json(sections);
    } catch (e) {
      ctx.logError(e, "Failed to fetch sections");
      return ctx.json({ error: "Internal Server Error" }, 500);
    }
  });

  router.get(sectionsPath(`/:id`), async (ctx) => {
    await ctx.requireAdminAuth();
    const { id } = ctx.params;
    const section = await prisma.sportSection.findUnique({
      where: { id },
    });
    if (!section) {
      return ctx.json({ error: "Section not found" }, 404);
    }
    return ctx.json(section);
  });

  router.post(sectionsPath(""), async (ctx) => {
    await ctx.requireAdminAuth();
    ctx.verifyAdminCsrfToken();
    const data = await ctx.readJson<SportSection>();
    // In a real app, validate data with Zod or similar
    try {
      const section = await prisma.sportSection.create({
        data: {
          id: data.id,
          title: data.title,
          summary: data.summary,
          focus: data.focus,
          format: data.format,
          contactLevel: data.contactLevel,
          intensity: data.intensity,
          recommendedFor: data.recommendedFor as object,
          expectedResults: data.expectedResults as object,
          extraBenefits: data.extraBenefits,
          prerequisites: data.prerequisites,
          imagePath: data.imagePath,
          locationHint: data.locationHint,
          similarityVector: data.similarityVector as object,
        },
      });
      invalidateSectionsCache();
      return ctx.json(section, 201);
    } catch (e) {
      ctx.logError(e, "Failed to create section");
      return ctx.json({ error: "Failed to create section" }, 400);
    }
  });

  router.put(sectionsPath(`/:id`), async (ctx) => {
    await ctx.requireAdminAuth();
    ctx.verifyAdminCsrfToken();
    const { id } = ctx.params;
    const data = await ctx.readJson<SportSection>();
    try {
      const section = await prisma.sportSection.update({
        where: { id },
        data: {
          title: data.title,
          summary: data.summary,
          focus: data.focus,
          format: data.format,
          contactLevel: data.contactLevel,
          intensity: data.intensity,
          recommendedFor: data.recommendedFor as object,
          expectedResults: data.expectedResults as object,
          extraBenefits: data.extraBenefits,
          prerequisites: data.prerequisites,
          imagePath: data.imagePath,
          locationHint: data.locationHint,
          similarityVector: data.similarityVector as object,
        },
      });
      invalidateSectionsCache();
      return ctx.json(section);
    } catch (e) {
      ctx.logError(e, "Failed to update section");
      return ctx.json({ error: "Failed to update section" }, 400);
    }
  });

  router.delete(sectionsPath(`/:id`), async (ctx) => {
    await ctx.requireAdminAuth();
    ctx.verifyAdminCsrfToken();
    const { id } = ctx.params;
    try {
      await prisma.sportSection.delete({
        where: { id },
      });
      invalidateSectionsCache();
      return ctx.json({ success: true });
    } catch (e) {
      ctx.logError(e, "Failed to delete section");
      return ctx.json({ error: "Failed to delete section" }, 400);
    }
  });
}
