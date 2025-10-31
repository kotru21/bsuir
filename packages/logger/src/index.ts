import pino, { type LoggerOptions } from "pino";

export interface CreateLoggerOptions {
  name?: string;
  level?: LoggerOptions["level"];
  pretty?: boolean;
}

export function createLogger(options: CreateLoggerOptions = {}) {
  const {
    name = "bsuir-admin",
    level = process.env.LOG_LEVEL ?? "info",
    pretty = process.env.NODE_ENV !== "production",
  } = options;

  return pino({
    name,
    level,
    transport: pretty
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        }
      : undefined,
  });
}
