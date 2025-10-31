import { config as loadDotenv } from "dotenv";
import { z } from "zod";

let dotenvLoaded = false;
const schemaCache = new WeakMap<z.ZodTypeAny, unknown>();

export interface LoadConfigOptions {
  dotenvPath?: string;
  reload?: boolean;
}

export function loadConfig<T extends z.ZodTypeAny>(
  schema: T,
  options: LoadConfigOptions = {}
): z.infer<T> {
  if (!dotenvLoaded || options.dotenvPath) {
    loadDotenv({ path: options.dotenvPath });
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
