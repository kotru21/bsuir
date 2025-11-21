DO $$ BEGIN
    CREATE TYPE "Gender" AS ENUM ('male', 'female', 'unspecified');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "FitnessLevel" AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "TrainingFormat" AS ENUM ('individual', 'group', 'mixed');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "GoalTag" AS ENUM ('strength', 'endurance', 'flexibility', 'teamwork', 'martialArts', 'ballSports', 'aquatic', 'dance', 'coordination', 'rehabilitation', 'weightManagement', 'aesthetics', 'competition');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "ContactLevel" AS ENUM ('nonContact', 'lightContact', 'fullContact');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "SurveySubmission" (
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

CREATE TABLE IF NOT EXISTS "RecommendationSnapshot" (
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

CREATE TABLE IF NOT EXISTS "Session" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("key")
);

CREATE TABLE IF NOT EXISTS "SportSection" (
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

ALTER TABLE "SurveySubmission"
    ALTER COLUMN "gender" TYPE "Gender" USING "gender"::"Gender",
    ALTER COLUMN "fitnessLevel" TYPE "FitnessLevel" USING "fitnessLevel"::"FitnessLevel",
    ALTER COLUMN "preferredFormats" TYPE "TrainingFormat"[] USING COALESCE("preferredFormats", ARRAY[]::text[])::"TrainingFormat"[],
    ALTER COLUMN "desiredGoals" TYPE "GoalTag"[] USING COALESCE("desiredGoals", ARRAY[]::text[])::"GoalTag"[];

ALTER TABLE "SportSection"
    ALTER COLUMN "focus" TYPE "GoalTag"[] USING COALESCE("focus", ARRAY[]::text[])::"GoalTag"[],
    ALTER COLUMN "format" TYPE "TrainingFormat" USING "format"::"TrainingFormat",
    ALTER COLUMN "contactLevel" TYPE "ContactLevel" USING "contactLevel"::"ContactLevel",
    ALTER COLUMN "intensity" TYPE "FitnessLevel" USING "intensity"::"FitnessLevel";

ALTER TABLE "RecommendationSnapshot"
    DROP CONSTRAINT IF EXISTS "RecommendationSnapshot_submissionId_fkey";
ALTER TABLE "RecommendationSnapshot"
    ADD CONSTRAINT "RecommendationSnapshot_submissionId_fkey"
    FOREIGN KEY ("submissionId") REFERENCES "SurveySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "SurveySubmission_createdAt_idx" ON "SurveySubmission"("createdAt");
CREATE INDEX IF NOT EXISTS "SurveySubmission_gender_idx" ON "SurveySubmission"("gender");
CREATE INDEX IF NOT EXISTS "SurveySubmission_fitnessLevel_idx" ON "SurveySubmission"("fitnessLevel");
CREATE INDEX IF NOT EXISTS "SurveySubmission_desiredGoals_idx" ON "SurveySubmission" USING GIN ("desiredGoals");
CREATE INDEX IF NOT EXISTS "SurveySubmission_preferredFormats_idx" ON "SurveySubmission" USING GIN ("preferredFormats");
CREATE INDEX IF NOT EXISTS "RecommendationSnapshot_submissionId_rank_idx" ON "RecommendationSnapshot"("submissionId", "rank");
CREATE INDEX IF NOT EXISTS "RecommendationSnapshot_sectionId_idx" ON "RecommendationSnapshot"("sectionId");
CREATE INDEX IF NOT EXISTS "SportSection_format_idx" ON "SportSection"("format");
CREATE INDEX IF NOT EXISTS "SportSection_contactLevel_idx" ON "SportSection"("contactLevel");
CREATE INDEX IF NOT EXISTS "SportSection_intensity_idx" ON "SportSection"("intensity");
CREATE INDEX IF NOT EXISTS "SportSection_focus_idx" ON "SportSection" USING GIN ("focus");
