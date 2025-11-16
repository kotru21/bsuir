import { useId, useMemo } from "react";
import { Line } from "react-chartjs-2";
import type { TimelinePoint } from "../types/stats";
import "../charts/setup";
import { translateTimelineDate } from "../localization";

interface TimelineChartProps {
  points: TimelinePoint[];
  title?: string;
}

export function TimelineChart({
  points,
  title = "Динамика опросов",
}: TimelineChartProps): React.JSX.Element {
  const titleId = useId();
  const descriptionId = useId();
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
      maintainAspectRatio: false,
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

  const summaryText = chartData.labels.length
    ? chartData.labels
        .map(
          (label, index) =>
            `${label}: ${chartData.datasets[0].data[index]} анкет`
        )
        .join("; ")
    : "Нет данных";

  return (
    <figure
      role="group"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="w-full">
      <span id={titleId} className="sr-only">
        {title}
      </span>
      <p id={descriptionId} className="sr-only">
        {summaryText}
      </p>
      <div className="w-full h-56 sm:h-64 md:h-52">
        <Line
          data={chartData}
          options={options}
          role="img"
          aria-label={title}
        />
      </div>
    </figure>
  );
}
