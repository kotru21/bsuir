import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "../charts/setup";

interface FitnessDistributionChartProps {
  data: Record<string, number>;
}

const FITNESS_LABELS: Record<string, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

export function FitnessDistributionChart({
  data,
}: FitnessDistributionChartProps): React.JSX.Element {
  const chartData = useMemo(() => {
    const labels = Object.keys(data);
    const dataset = labels.map((label) => data[label] ?? 0);

    return {
      labels: labels.map((label) => FITNESS_LABELS[label] ?? label),
      datasets: [
        {
          label: "Количество",
          data: dataset,
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          borderRadius: 8,
        },
      ],
    };
  }, [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    }),
    []
  );

  return (
    <div className="card">
      <h2>Уровень подготовки</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
