-- Migration: Add enums, indexes, and soft deletes
-- This migration adds type safety with enums, performance indexes, and soft delete support

-- Create enum types
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'unspecified');
CREATE TYPE "FitnessLevel" AS ENUM ('low', 'medium', 'high');
CREATE TYPE "TrainingFormat" AS ENUM ('individual', 'group', 'mixed');
CREATE TYPE "ContactLevel" AS ENUM ('nonContact', 'lightContact', 'fullContact');

-- Add deletedAt columns for soft deletes
ALTER TABLE "SurveySubmission" ADD COLUMN "deletedAt" TIMESTAMP(3);
ALTER TABLE "SportSection" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- Add analytics columns to SportSection
ALTER TABLE "SportSection" ADD COLUMN "recommendationCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "SportSection" ADD COLUMN "averageScore" DOUBLE PRECISION;
ALTER TABLE "SportSection" ADD COLUMN "lastRecommendedAt" TIMESTAMP(3);

-- Convert string columns to enums for SurveySubmission
ALTER TABLE "SurveySubmission" 
  ALTER COLUMN "gender" TYPE "Gender" USING "gender"::"Gender",
  ALTER COLUMN "fitnessLevel" TYPE "FitnessLevel" USING "fitnessLevel"::"FitnessLevel";

-- Convert preferredFormats array
ALTER TABLE "SurveySubmission"
  ALTER COLUMN "preferredFormats" TYPE "TrainingFormat"[] 
  USING "preferredFormats"::text[]::"TrainingFormat"[];

-- Convert string columns to enums for SportSection
ALTER TABLE "SportSection"
  ALTER COLUMN "format" TYPE "TrainingFormat" USING "format"::"TrainingFormat",
  ALTER COLUMN "contactLevel" TYPE "ContactLevel" USING "contactLevel"::"ContactLevel",
  ALTER COLUMN "intensity" TYPE "FitnessLevel" USING "intensity"::"FitnessLevel";

-- Create new indexes for SurveySubmission
CREATE INDEX "SurveySubmission_gender_fitnessLevel_idx" ON "SurveySubmission"("gender", "fitnessLevel");
CREATE INDEX "SurveySubmission_createdAt_gender_idx" ON "SurveySubmission"("createdAt", "gender");
CREATE INDEX "SurveySubmission_telegramUserId_idx" ON "SurveySubmission"("telegramUserId");
CREATE INDEX "SurveySubmission_deletedAt_idx" ON "SurveySubmission"("deletedAt");

-- Create new indexes for RecommendationSnapshot
CREATE INDEX "RecommendationSnapshot_sectionId_score_idx" ON "RecommendationSnapshot"("sectionId", "score");
CREATE INDEX "RecommendationSnapshot_createdAt_idx" ON "RecommendationSnapshot"("createdAt");

-- Create new indexes for SportSection
CREATE INDEX "SportSection_format_intensity_idx" ON "SportSection"("format", "intensity");
CREATE INDEX "SportSection_contactLevel_idx" ON "SportSection"("contactLevel");
CREATE INDEX "SportSection_deletedAt_idx" ON "SportSection"("deletedAt");
CREATE INDEX "SportSection_recommendationCount_idx" ON "SportSection"("recommendationCount");

-- Create trigger function to update section stats
CREATE OR REPLACE FUNCTION update_section_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "SportSection"
  SET 
    "recommendationCount" = (
      SELECT COUNT(*) 
      FROM "RecommendationSnapshot" 
      WHERE "sectionId" = NEW."sectionId"
    ),
    "averageScore" = (
      SELECT AVG("score") 
      FROM "RecommendationSnapshot" 
      WHERE "sectionId" = NEW."sectionId"
    ),
    "lastRecommendedAt" = NEW."createdAt"
  WHERE id = NEW."sectionId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER recommendation_stats_trigger
  AFTER INSERT ON "RecommendationSnapshot"
  FOR EACH ROW
  EXECUTE FUNCTION update_section_stats();

-- Comment the migration
COMMENT ON TYPE "Gender" IS 'User gender enum';
COMMENT ON TYPE "FitnessLevel" IS 'Fitness level classification';
COMMENT ON TYPE "TrainingFormat" IS 'Training format preference';
COMMENT ON TYPE "ContactLevel" IS 'Contact level in sport activities';
