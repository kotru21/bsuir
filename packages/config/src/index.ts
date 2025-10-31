import { config as loadDotenv } from "dotenv";
import { z } from "zod";

let dotenvLoaded = false;
const schemaCache = new WeakMap<z.ZodTypeAny, unknown>();
const missingEnvWarnings = new Set<string>();

export interface LoadConfigOptions {
  dotenvPath?: string;
  reload?: boolean;
}

export function loadConfig<T extends z.ZodTypeAny>(
  schema: T,
  options: LoadConfigOptions = {}
): z.infer<T> {
  if (!dotenvLoaded || options.dotenvPath) {
    const targetPath = options.dotenvPath ?? ".env";
    const result = loadDotenv({ path: options.dotenvPath });

    if (result.error) {
      const error = result.error as NodeJS.ErrnoException;
      if (error.code === "ENOENT") {
        if (!missingEnvWarnings.has(targetPath)) {
          console.warn(
            `[config] No environment file found at ${targetPath}. Falling back to process.env and schema defaults.`
          );
          missingEnvWarnings.add(targetPath);
        }
      } else {
        throw error;
      }
    }

    if (!options.dotenvPath) {
      dotenvLoaded = true;
    }
  }

  if (!options.reload) {
    const cached = schemaCache.get(schema);
    if (cached) {
      return cached as z.infer<T>;
    }
  }

  const parsed = schema.parse(process.env);
  schemaCache.set(schema, parsed);
  return parsed as z.infer<T>;
}
