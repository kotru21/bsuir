import { TelegramError } from "telegraf";
import type { RecommendationContext } from "./session.js";

const TELEGRAM_BAD_REQUEST = 400;

export function stripMarkdownEscapes(text: string): string {
  return text.replace(/\\([_\-*\[\]()~`>#\+=|{}.!\\])/g, "$1");
}

type MarkdownExtra = Parameters<
  RecommendationContext["replyWithMarkdownV2"]
>[1];

export async function replyMarkdownV2Safe(
  ctx: RecommendationContext,
  text: string,
  extra?: MarkdownExtra
): Promise<void> {
  try {
    await ctx.replyWithMarkdownV2(text, extra);
  } catch (err) {
    if (err instanceof TelegramError && err.code === TELEGRAM_BAD_REQUEST) {
      console.error(
        "MarkdownV2 send failed, falling back to plain text:",
        err.description
      );
      try {
        await ctx.reply(stripMarkdownEscapes(text), extra);
      } catch (fallbackErr) {
        console.error("Failed to send plain text fallback:", fallbackErr);
        throw fallbackErr;
      }
    } else {
      throw err;
    }
  }
}

type PhotoSource = Parameters<RecommendationContext["replyWithPhoto"]>[0];
type PhotoExtra = Parameters<RecommendationContext["replyWithPhoto"]>[1];

export async function replyWithPhotoMarkdownV2Safe(
  ctx: RecommendationContext,
  factory: () => PhotoSource,
  extra?: PhotoExtra
): Promise<void> {
  try {
    await ctx.replyWithPhoto(factory(), extra);
  } catch (err) {
    if (err instanceof TelegramError && err.code === TELEGRAM_BAD_REQUEST) {
      console.error(
        "Failed to send photo with MarkdownV2 caption:",
        err.description
      );
      const fallbackExtra: Record<string, unknown> = extra
        ? { ...(extra as Record<string, unknown>) }
        : {};
      const caption = fallbackExtra.caption;
      if (typeof caption === "string") {
        fallbackExtra.caption = stripMarkdownEscapes(caption);
      }
      if ("parse_mode" in fallbackExtra) {
        delete fallbackExtra.parse_mode;
      }
      try {
        await ctx.replyWithPhoto(factory(), fallbackExtra as PhotoExtra);
      } catch (fallbackErr) {
        console.error("Fallback photo send failed:", fallbackErr);
        throw fallbackErr;
      }
    } else {
      throw err;
    }
  }
}
