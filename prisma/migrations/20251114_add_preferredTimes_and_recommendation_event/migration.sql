-- Migration: add preferredTimes column and RecommendationEvent model
-- Add preferredTimes to SurveySubmission (text[])
ALTER TABLE "SurveySubmission" ADD COLUMN IF NOT EXISTS "preferredTimes" text[];

-- Create recommendation_event table
CREATE TABLE IF NOT EXISTS "RecommendationEvent" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "telegramUserId" text,
  "chatId" text,
  "sectionId" text NOT NULL,
  "eventType" text NOT NULL,
  "payload" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "RecommendationEvent_sectionId_idx" ON "RecommendationEvent" ("sectionId");
CREATE INDEX IF NOT EXISTS "RecommendationEvent_createdAt_idx" ON "RecommendationEvent" ("createdAt");

-- Note: run `npx prisma migrate deploy` to apply this migration