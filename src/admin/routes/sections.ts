import type { FastifyInstance } from "fastify";
import { getPrismaClient } from "../../infrastructure/prismaClient.js";
import type { SportSection } from "../../types.js";
import type { AdminConfig } from "../config.js";

export async function registerSectionsRoutes(
  app: FastifyInstance,
  _options: { config: AdminConfig }
): Promise<void> {
  const prisma = getPrismaClient();

  app.get("/api/sections", async (_req, _reply) => {
    const sections = await prisma.sportSection.findMany({
      orderBy: { title: "asc" },
    });
    return sections;
  });

  app.get("/api/sections/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const section = await prisma.sportSection.findUnique({
      where: { id },
    });
    if (!section) {
      return reply.status(404).send({ error: "Section not found" });
    }
    return section;
  });

  app.post("/api/sections", async (req, reply) => {
    const data = req.body as SportSection;
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
          recommendedFor: data.recommendedFor as any,
          expectedResults: data.expectedResults as any,
          extraBenefits: data.extraBenefits,
          prerequisites: data.prerequisites,
          imagePath: data.imagePath,
          locationHint: data.locationHint,
          similarityVector: data.similarityVector as any,
        },
      });
      return section;
    } catch (e) {
      req.log.error(e);
      return reply.status(400).send({ error: "Failed to create section" });
    }
  });

  app.put("/api/sections/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const data = req.body as SportSection;
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
          recommendedFor: data.recommendedFor as any,
          expectedResults: data.expectedResults as any,
          extraBenefits: data.extraBenefits,
          prerequisites: data.prerequisites,
          imagePath: data.imagePath,
          locationHint: data.locationHint,
          similarityVector: data.similarityVector as any,
        },
      });
      return section;
    } catch (e) {
      req.log.error(e);
      return reply.status(400).send({ error: "Failed to update section" });
    }
  });

  app.delete("/api/sections/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    try {
      await prisma.sportSection.delete({
        where: { id },
      });
      return { success: true };
    } catch (e) {
      req.log.error(e);
      return reply.status(400).send({ error: "Failed to delete section" });
    }
  });
}
