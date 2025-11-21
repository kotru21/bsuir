// Compatibility TypeScript declaration to allow importing the ESM entry directly
// (e.g. "@prisma/adapter-pg/dist/index.js") while keeping the package's
// original types available. This avoids TypeScript complaining about missing
// type declarations when we explicitly import from the dist ESM entry.
declare module "@prisma/adapter-pg/dist/index.js" {
  export * from "@prisma/adapter-pg";
}
