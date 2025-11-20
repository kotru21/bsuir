import { Context, Middleware } from "telegraf";
import { getPrismaClient } from "../infrastructure/prismaClient.js";
import { RecommendationSession } from "./session.js";

interface SessionContext extends Context {
  session?: RecommendationSession;
}

export function prismaSession(): Middleware<SessionContext> {
  return async (ctx, next) => {
    const key = ctx.chat?.id?.toString();
    if (!key) return next();

    const prisma = getPrismaClient();
    let session = {};

    try {
      const record = await prisma.session.findUnique({ where: { key } });
      if (record) {
        session = JSON.parse(record.value);
      }
    } catch (e) {
      console.error("Failed to load session", e);
    }

    // Assign session to context
    // Note: We need to be careful not to overwrite if it already exists,
    // but usually this middleware is the source of truth.
    ctx.session = session;

    await next();

    // Save session after processing
    if (ctx.session) {
      try {
        const value = JSON.stringify(ctx.session);
        await prisma.session.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      } catch (e) {
        console.error("Failed to save session", e);
      }
    }
  };
}
