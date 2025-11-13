import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import "../charts/setup";
import { Card } from "./Card";

interface GenderDistributionChartProps {
  data: Record<string, number>;
}

const COLORS = ["#38bdf8", "#a855f7", "#f97316", "#14b8a6"];

export function GenderDistributionChart({
  data,
}: GenderDistributionChartProps): React.JSX.Element {
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
    <Card className="flex flex-col gap-4">
      <h2>Распределение по полу</h2>
      <div className="w-full">
        <div className="w-full h-56 sm:h-64 md:h-52">
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "bottom" } },
            }}
          />
        </div>
      </div>
    </Card>
  );
}
