import type { HTMLAttributes, ReactNode } from "react";
import { memo } from "react";
import { cn } from "../lib/cn";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
}

function CardBase({ className, title, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-elevated backdrop-blur-sm transition-shadow dark:border-slate-700/60 dark:bg-slate-900/70 min-w-0",
        className
      )}
      {...props}>
      {title ? (
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      ) : null}
      {children}
    </div>
  );
}
export const Card = memo(CardBase);
