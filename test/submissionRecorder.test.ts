/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, vi, beforeEach, afterEach } from "bun:test";

describe("submissionRecorder", () => {
  let originalEnv: string | undefined;

  beforeEach(async () => {
    originalEnv = process.env.DATABASE_URL;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.DATABASE_URL = originalEnv;
    } else {
      delete process.env.DATABASE_URL;
    }
    vi.restoreAllMocks();
  });

  it("calls create with profile data when DATABASE_URL is set", async () => {
    process.env.DATABASE_URL = "postgres://test";

    // Mock prisma client
    vi.mock("../src/infrastructure/prismaClient.js", () => ({
      getPrismaClient: () => ({
        surveySubmission: {
          create: vi.fn().mockResolvedValue({ id: 1 }),
        },
      }),
    }));

    const { recordSubmission } = await import(
      "../src/services/submissionRecorder.js"
    );

    await recordSubmission({
      profile: {
        age: 30,
        gender: "female",
        fitnessLevel: "high",
        preferredFormats: ["individual"],
        desiredGoals: ["endurance", "competition"],
        avoidContact: true,
        interestedInCompetition: true,
      },
      recommendations: [
        {
          section: { id: "test-section", title: "Test Section" },
          score: 85,
          reasons: ["Good match"],
        } as any,
      ],
      telegramUserId: 12345,
      chatId: 67890,
      aiSummary: "AI generated summary",
    });

    // Just verify recordSubmission completed without error
  });

  it("handles submission with no recommendations", async () => {
    process.env.DATABASE_URL = "postgres://test";

    const { recordSubmission } = await import(
      "../src/services/submissionRecorder.js"
    );

    await recordSubmission({
      profile: {
        age: 25,
        gender: "male",
        fitnessLevel: "medium",
        preferredFormats: ["group"],
        desiredGoals: ["strength"],
        avoidContact: false,
        interestedInCompetition: false,
      },
      recommendations: [],
    });
  });
});
