import { Middleware } from "telegraf";
import { getPrismaClient } from "../infrastructure/prismaClient.js";
import type { PrismaClientWithSession } from "../infrastructure/prismaExtensions.js";
import { RecommendationContext, RecommendationSession } from "./session.js";

export function prismaSession(): Middleware<RecommendationContext> {
  return async (ctx, next) => {
    const key = ctx.chat?.id?.toString();
    if (!key) return next();

    const prisma = getPrismaClient() as PrismaClientWithSession;
    let session: Partial<RecommendationSession> = {};

    try {
      // Use Prisma client extension if available (Prisma v7 clientExtensions)
      const parsed = await prisma.session?.getParsed?.({ key });
      if (parsed !== undefined) {
        session = parsed ?? {};
      } else {
        const record = await prisma.session.findUnique({ where: { key } });
        if (record) session = JSON.parse(record.value);
      }
    } catch (e) {
      console.error("Failed to load session", e);
    }

    // Assign session to context
    // Note: We need to be careful not to overwrite if it already exists,
    // but usually this middleware is the source of truth.
    // @ts-expect-error - session type mismatch with WizardContext requirements but sufficient for runtime
    ctx.session = session;

    await next();

    // Save session after processing
    if (ctx.session) {
      try {
        // Prefer Prisma extension helper on v7
        const extensionResult = await prisma.session?.upsertParsed?.({
          key,
          value: ctx.session,
        });
        if (!extensionResult) {
          const value = JSON.stringify(ctx.session);
          await prisma.session.upsert({
            where: { key },
            update: { value },
            create: { key, value },
          });
        }
      } catch (e) {
        console.error("Failed to save session", e);
      }
    }
  };
}
