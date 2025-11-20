import { Prisma, PrismaClient } from "@prisma/client";

// Session helper extension for Prisma Client
// Adds model-level helpers that serialize/deserialize `Session.value` JSON
// Note: This uses `Prisma.defineExtension` and requires clientExtensions preview feature in `schema.prisma`.
export type SessionHelpers = {
  getParsed?: (args: { key: string }) => Promise<unknown | null>;
  upsertParsed?: (args: { key: string; value: unknown }) => Promise<unknown>;
};

export type PrismaClientWithSession = PrismaClient & {
  session?: SessionHelpers;
};

export const sessionExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: "session_helpers",
    model: {
      session: {
        async getParsed(this: PrismaClient, args: { key: string }) {
          const rec = await client.session.findUnique({
            where: { key: args.key },
          });
          if (!rec) return null;
          try {
            return JSON.parse(rec.value);
          } catch (e) {
            console.error("Failed to parse session value", e);
            return null;
          }
        },

        async upsertParsed(
          this: PrismaClient,
          args: { key: string; value: unknown }
        ) {
          const jsonValue = JSON.stringify(args.value);
          return client.session.upsert({
            where: { key: args.key },
            update: { value: jsonValue },
            create: { key: args.key, value: jsonValue },
          });
        },
      },
    },
  });
});

export default sessionExtension;
