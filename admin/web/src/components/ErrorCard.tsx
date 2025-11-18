import type { ReactNode } from "react";
import { Card } from "./Card";
import { Button } from "./Button";

export type ErrorCardVariant = "danger" | "warning";

export function ErrorCard({
  title,
  message,
  onRetry,
  buttonLabel = "Повторить",
  variant = "danger",
}: {
  title?: string;
  message: string | ReactNode;
  onRetry?: () => void | Promise<void>;
  buttonLabel?: string;
  variant?: ErrorCardVariant;
}) {
  const base =
    "flex items-start gap-3 rounded-2xl p-4 text-sm border" +
    " dark:border-transparent";

  const classes =
    variant === "danger"
      ? `${base} bg-rose-50/80 border-rose-300/60 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/40 dark:text-rose-200`
      : `${base} bg-amber-50 border-amber-400/60 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/50 dark:text-amber-200`;

  return (
    <Card className="flex flex-col gap-4">
      {title ? <h2>{title}</h2> : null}
      <div className={classes}>
        <span className="flex-1">{message}</span>
        {onRetry ? (
          <Button
            variant="secondary"
            onClick={() => {
              const res = onRetry();
              if (
                res &&
                typeof (res as unknown as { then?: unknown }).then ===
                  "function"
              ) {
                void (res as Promise<void>).catch(() => undefined);
              }
            }}>
            {buttonLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
