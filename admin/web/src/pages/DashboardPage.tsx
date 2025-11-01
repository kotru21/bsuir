import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDemographics, fetchOverview, fetchTimeline } from "../api/stats";
import { MetricCard } from "../components/MetricCard";
import { GenderDistributionChart } from "../components/GenderDistributionChart";
import { FitnessDistributionChart } from "../components/FitnessDistributionChart";
import { TimelineChart } from "../components/TimelineChart";
import { FullscreenSpinner } from "../components/FullscreenSpinner";

function formatAverageAge(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }
  return value.toFixed(1);
}

export function DashboardPage(): JSX.Element {
  const [rangeDays, setRangeDays] = useState(30);

  const overviewQuery = useQuery({
    queryKey: ["overview"],
    queryFn: fetchOverview,
  });

  const demographicsQuery = useQuery({
    queryKey: ["demographics"],
    queryFn: fetchDemographics,
  });

  const timelineQuery = useQuery({
    queryKey: ["timeline", rangeDays],
    queryFn: () => fetchTimeline(rangeDays),
  });

  const overview = overviewQuery.data;
  const demographics = demographicsQuery.data;
  const timeline = timelineQuery.data;

  const timelinePoints = useMemo(
    () => timeline?.points ?? [],
    [timeline]
  );

  const loading =
    overviewQuery.isLoading ||
    demographicsQuery.isLoading ||
    timelineQuery.isLoading;

  if (loading) {
    return <FullscreenSpinner message="Загружаем статистику..." />;
  }

  if (!overview || !demographics || !timeline) {
    return <p>Нет данных для отображения.</p>;
  }

  const topFormats = overview.formatLeaders;
  const topGoals = overview.goalLeaders;

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <MetricCard
          title="Всего опросов"
          value={overview.totalSubmissions.toString()}
          hint={`Последние 7 дней: ${overview.submissionsLast7Days}`}
        />
        <MetricCard
          title="Средний возраст"
          value={formatAverageAge(overview.averageAge)}
          hint={
            overview.lastSubmissionAt
              ? `Последняя анкета: ${new Date(
                  overview.lastSubmissionAt
                ).toLocaleString("ru-RU")}`
              : undefined
          }
        />
        <MetricCard
          title="Избегают контакта"
          value={`${overview.contactPreference.avoidContact}`}
          hint={`Допускают контакт: ${overview.contactPreference.allowContact}`}
        />
        <MetricCard
          title="Интерес к соревнованиям"
          value={`${overview.competitionInterest.interested}`}
          hint={`Без интереса: ${overview.competitionInterest.notInterested}`}
        />
      </div>

      <div className="charts-grid">
        <GenderDistributionChart data={overview.genderDistribution} />
        <FitnessDistributionChart data={overview.fitnessDistribution} />
        <div className="card">
          <h2>Популярные форматы</h2>
          <div className="metrics-list">
            {topFormats.map(
              ({ format, count }: { format: string; count: number }) => (
                <div key={format} className="metrics-item">
                  <span>{format}</span>
                  <strong>{count}</strong>
                </div>
              )
            )}
          </div>
        </div>
        <div className="card">
          <h2>Популярные цели</h2>
          <div className="metrics-list">
            {topGoals.map(
              ({ goal, count }: { goal: string; count: number }) => (
                <div key={goal} className="metrics-item">
                  <span>{goal}</span>
                  <strong>{count}</strong>
                </div>
              )
            )}
          </div>
        </div>
        <div className="card">
          <h2>Возрастные группы</h2>
          <div className="metrics-list">
            {demographics.ageBuckets.map(
              ({ label, count }: { label: string; count: number }) => (
                <div key={label} className="metrics-item">
                  <span>{label}</span>
                  <strong>{count}</strong>
                </div>
              )
            )}
          </div>
        </div>
        <div className="card timeline">
          <div className="timeline__header">
            <h2>Динамика опросов</h2>
            <div className="timeline__filters">
              {[7, 30, 90].map((value) => (
                <button
                  key={value}
                  className={
                    value === rangeDays ? "button" : "button button--secondary"
                  }
                  onClick={() => setRangeDays(value)}>
                  {value} дн.
                </button>
              ))}
            </div>
          </div>
          <TimelineChart points={timelinePoints} />
        </div>
      </div>
    </div>
  );
}
