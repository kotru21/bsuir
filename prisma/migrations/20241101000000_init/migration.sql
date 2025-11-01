-- CreateTable
CREATE TABLE "SurveySubmission" (
  "id" TEXT NOT NULL,
  "telegramUserId" TEXT,
  "chatId" TEXT,
  "age" INTEGER NOT NULL,
  "gender" TEXT NOT NULL,
  "fitnessLevel" TEXT NOT NULL,
  "preferredFormats" TEXT[] NOT NULL,
  "desiredGoals" TEXT[] NOT NULL,
  "avoidContact" BOOLEAN NOT NULL,
  "interestedInCompetition" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RecommendationSnapshot_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "RecommendationSnapshot_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SurveySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SurveySubmission_createdAt_idx" ON "SurveySubmission"("createdAt");
CREATE INDEX "SurveySubmission_gender_idx" ON "SurveySubmission"("gender");
CREATE INDEX "SurveySubmission_fitnessLevel_idx" ON "SurveySubmission"("fitnessLevel");
CREATE INDEX "RecommendationSnapshot_submission_rank_idx" ON "RecommendationSnapshot"("submissionId", "rank");
CREATE INDEX "RecommendationSnapshot_sectionId_idx" ON "RecommendationSnapshot"("sectionId");
