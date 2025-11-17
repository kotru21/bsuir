import { memo } from "react";
import { Card } from "./Card";

interface MetricCardProps {
  title: string;
  value: string;
  hint?: string;
}

export const MetricCard = memo(function MetricCard({
  title,
  value,
  hint,
}: MetricCardProps): React.JSX.Element {
  return (
    <Card className="flex flex-col gap-3">
      <h2>{title}</h2>
      <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {value}
      </div>
      {hint ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </Card>
  );
});
