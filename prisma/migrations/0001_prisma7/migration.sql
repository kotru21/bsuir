-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'unspecified');

-- CreateEnum
CREATE TYPE "FitnessLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "TrainingFormat" AS ENUM ('individual', 'group', 'mixed');

-- CreateEnum
CREATE TYPE "GoalTag" AS ENUM ('strength', 'endurance', 'flexibility', 'teamwork', 'martialArts', 'ballSports', 'aquatic', 'dance', 'coordination', 'rehabilitation', 'weightManagement', 'aesthetics', 'competition');

-- CreateEnum
CREATE TYPE "ContactLevel" AS ENUM ('nonContact', 'lightContact', 'fullContact');

-- CreateTable
CREATE TABLE "SurveySubmission" (
    "id" TEXT NOT NULL,
    "telegramUserId" TEXT,
    "chatId" TEXT,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "fitnessLevel" "FitnessLevel" NOT NULL,
    "preferredFormats" "TrainingFormat"[],
    "desiredGoals" "GoalTag"[],
    "avoidContact" BOOLEAN NOT NULL,
    "interestedInCompetition" BOOLEAN NOT NULL,
    "aiSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationSnapshot" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "reasons" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "SportSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "focus" "GoalTag"[],
    "format" "TrainingFormat" NOT NULL,
    "contactLevel" "ContactLevel" NOT NULL,
    "intensity" "FitnessLevel" NOT NULL,
    "recommendedFor" JSONB NOT NULL,
    "expectedResults" JSONB NOT NULL,
    "extraBenefits" TEXT[],
    "prerequisites" TEXT,
    "imagePath" TEXT,
    "locationHint" TEXT,
    "similarityVector" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SportSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SurveySubmission_createdAt_idx" ON "SurveySubmission"("createdAt");

-- CreateIndex
CREATE INDEX "SurveySubmission_gender_idx" ON "SurveySubmission"("gender");

-- CreateIndex
CREATE INDEX "SurveySubmission_fitnessLevel_idx" ON "SurveySubmission"("fitnessLevel");

-- CreateIndex
CREATE INDEX "SurveySubmission_desiredGoals_idx" ON "SurveySubmission" USING GIN ("desiredGoals");

-- CreateIndex
CREATE INDEX "SurveySubmission_preferredFormats_idx" ON "SurveySubmission" USING GIN ("preferredFormats");

-- CreateIndex
CREATE INDEX "RecommendationSnapshot_submissionId_rank_idx" ON "RecommendationSnapshot"("submissionId", "rank");

-- CreateIndex
CREATE INDEX "RecommendationSnapshot_sectionId_idx" ON "RecommendationSnapshot"("sectionId");

-- CreateIndex
CREATE INDEX "SportSection_format_idx" ON "SportSection"("format");

-- CreateIndex
CREATE INDEX "SportSection_contactLevel_idx" ON "SportSection"("contactLevel");

-- CreateIndex
CREATE INDEX "SportSection_intensity_idx" ON "SportSection"("intensity");

-- CreateIndex
CREATE INDEX "SportSection_focus_idx" ON "SportSection" USING GIN ("focus");

-- AddForeignKey
ALTER TABLE "RecommendationSnapshot" ADD CONSTRAINT "RecommendationSnapshot_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SurveySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
