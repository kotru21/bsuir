import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDemographics, fetchOverview, fetchTimeline } from "../api/stats";
import { MetricCard } from "../components/MetricCard";
import { GenderDistributionChart } from "../components/GenderDistributionChart";
import { FitnessDistributionChart } from "../components/FitnessDistributionChart";
import { TimelineChart } from "../components/TimelineChart";
import { FullscreenSpinner } from "../components/FullscreenSpinner";
import cardStyles from "../components/Card.module.css";
import statusStyles from "../components/StatusMessage.module.css";
import buttonStyles from "../components/Button.module.css";
import dashboardStyles from "../components/Dashboard.module.css";
import {
  GENDER_ORDER,
  mapRecordWithTranslation,
  translateGenderPlural,
  translateGoal,
  translateTrainingFormat,
} from "../localization";

function formatAverageAge(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }
  return value.toFixed(1);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Не удалось загрузить статистику. Попробуйте еще раз.";
}

export function DashboardPage(): ReactElement {
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

  const timelinePoints = useMemo(() => timeline?.points ?? [], [timeline]);

  const genderDistribution = useMemo(() => {
    const source = overview?.genderDistribution ?? {};
    return mapRecordWithTranslation(
      source,
      translateGenderPlural,
      GENDER_ORDER
    );
  }, [overview]);

  const topFormats = useMemo(() => {
    const leaders = overview?.formatLeaders ?? [];
    return leaders
      .filter((entry) => Boolean(entry?.format))
      .map(({ format, count }) => ({
        key: format,
        label: translateTrainingFormat(format),
        count,
      }));
  }, [overview]);

  const topGoals = useMemo(() => {
    const leaders = overview?.goalLeaders ?? [];
    return leaders
      .filter((entry) => Boolean(entry?.goal))
      .map(({ goal, count }) => ({
        key: goal,
        label: translateGoal(goal),
        count,
      }));
  }, [overview]);

  const loading =
    overviewQuery.isLoading ||
    demographicsQuery.isLoading ||
    timelineQuery.isLoading;

  if (loading) {
    return <FullscreenSpinner message="Загружаем статистику..." />;
  }

  const hasError =
    overviewQuery.isError || demographicsQuery.isError || timelineQuery.isError;

  if (hasError) {
    const firstError =
      overviewQuery.error || demographicsQuery.error || timelineQuery.error;
    const message = getErrorMessage(firstError);

    return (
      <div className={cardStyles.card}>
        <h2>Не удалось загрузить статистику</h2>
        <div className={`${statusStyles.status} ${statusStyles.error}`}>
          <span className={statusStyles.text}>{message}</span>
          <button
            className={`${buttonStyles.button} ${buttonStyles.secondary}`}
            onClick={() => {
              void Promise.all([
                overviewQuery.refetch(),
                demographicsQuery.refetch(),
                timelineQuery.refetch(),
              ]).catch(() => undefined);
            }}>
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  if (!overview || !demographics || !timeline) {
    return <p>Нет данных для отображения.</p>;
  }

  return (
    <div className={dashboardStyles.dashboard}>
      <div className={dashboardStyles.dashboardGrid}>
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
        <MetricCard
          title="AI-пояснения"
          value={`${overview.aiSummaryStats.withSummary}`}
          hint={`Покрытие: ${overview.aiSummaryStats.coveragePercent}% (без: ${overview.aiSummaryStats.withoutSummary})`}
        />
      </div>

      <div className={dashboardStyles.chartsGrid}>
        <GenderDistributionChart data={genderDistribution} />
        <FitnessDistributionChart data={overview.fitnessDistribution} />
        {[
          { title: "Популярные форматы", items: topFormats },
          { title: "Популярные цели", items: topGoals },
          { title: "Возрастные группы", items: demographics.ageBuckets },
        ].map((block) => (
          <div key={block.title} className={cardStyles.card}>
            <h2>{block.title}</h2>
            <div className={dashboardStyles.metricsList}>
              {block.items.length ? (
                block.items.map((it: any) => (
                  <div
                    key={it.key ?? it.label}
                    className={dashboardStyles.metricsItem}>
                    <span>{it.label ?? it.label}</span>
                    <strong>{it.count ?? "—"}</strong>
                  </div>
                ))
              ) : (
                <div className={dashboardStyles.metricsItem}>
                  <span>Пока нет данных</span>
                  <strong>—</strong>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className={`${cardStyles.card} ${dashboardStyles.timeline}`}>
          <div className={dashboardStyles.timelineHeader}>
            <h2>Динамика опросов</h2>
            <div className={dashboardStyles.timelineFilters}>
              {[7, 30, 90].map((value) => (
                <button
                  key={value}
                  className={
                    value === rangeDays
                      ? buttonStyles.button
                      : `${buttonStyles.button} ${buttonStyles.secondary}`
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
