import cardStyles from "./Card.module.css";
import metricStyles from "./Metric.module.css";

interface MetricCardProps {
  title: string;
  value: string;
  hint?: string;
}

export function MetricCard({
  title,
  value,
  hint,
}: MetricCardProps): React.JSX.Element {
  return (
    <div className={cardStyles.card}>
      <h2>{title}</h2>
      <div className={metricStyles.value}>{value}</div>
      {hint ? <p className={metricStyles.hint}>{hint}</p> : null}
    </div>
  );
}
