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
    <div className="card">
      <h2>{title}</h2>
      <div className="metric-value">{value}</div>
      {hint ? <p className="metric-hint">{hint}</p> : null}
    </div>
  );
}
