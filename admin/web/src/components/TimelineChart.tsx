import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import type { TimelinePoint } from "../types/stats";
import "../charts/setup";
import { translateTimelineDate } from "../localization";
import cardStyles from "./Card.module.css";

interface TimelineChartProps {
  points: TimelinePoint[];
}

export function TimelineChart({
  points,
}: TimelineChartProps): React.JSX.Element {
  const chartData = useMemo(() => {
    const labels = points.map((point) => translateTimelineDate(point.date));
    const values = points.map((point) => point.submissions);
    return {
      labels,
      datasets: [
        {
          label: "Опросы",
          data: values,
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [points]);

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
          ticks: { precision: 0 },
        },
      },
    }),
    []
  );

  return (
    <div className={cardStyles.card}>
      <h2>Динамика опросов</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}
