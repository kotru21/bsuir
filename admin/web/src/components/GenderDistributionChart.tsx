import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import "../charts/setup";

interface GenderDistributionChartProps {
  data: Record<string, number>;
}

const COLORS = ["#38bdf8", "#a855f7", "#f97316", "#14b8a6"];

export function GenderDistributionChart({
  data,
}: GenderDistributionChartProps): JSX.Element {
  const chartData = useMemo(() => {
    const labels = Object.keys(data);
    const values = labels.map((label) => data[label] ?? 0);
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: labels.map((_, idx) => COLORS[idx % COLORS.length]),
          borderWidth: 0,
        },
      ],
    };
  }, [data]);

  return (
    <div className="card">
      <h2>Распределение по полу</h2>
      <Doughnut
        data={chartData}
        options={{ plugins: { legend: { position: "bottom" } } }}
      />
    </div>
  );
}
