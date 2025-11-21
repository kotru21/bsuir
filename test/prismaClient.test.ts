import { describe, it, expect } from "bun:test";

// simple sanity checks for the runtime client wrapper (not an end-to-end DB test)
import {
  getPrismaClient,
  disconnectPrisma,
} from "../src/infrastructure/prismaClient.js";

describe("prisma client wrapper", () => {
  it("instantiates a Prisma client (no crash) when DATABASE_URL is set", async () => {
    process.env.DATABASE_URL =
      process.env.DATABASE_URL ??
      "postgresql://user:pass@localhost:5432/db?schema=public";
    const prisma = getPrismaClient();
    expect(prisma).toBeTruthy();
    // The test environment may mock getPrismaClient in other test files.
    // Ensure we at least return a truthy client object and safely handle missing methods.
    if (typeof (prisma as any).$connect === "function") {
      expect(typeof (prisma as any).$disconnect).toBe("function");
      // don't actually open a connection in unit tests — just make sure disconnect works safely
      await disconnectPrisma();
    } else {
      // If we were given a mocked object (other tests), just check that it looks like an object
      expect(typeof prisma).toBe("object");
    }
  });
});
