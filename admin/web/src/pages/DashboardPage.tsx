import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDemographics, fetchOverview, fetchTimeline } from "../api/stats";
import { MetricCard } from "../components/MetricCard";
import { GenderDistributionChart } from "../components/GenderDistributionChart";
import { FitnessDistributionChart } from "../components/FitnessDistributionChart";
import { TimelineChart } from "../components/TimelineChart";
import { FullscreenSpinner } from "../components/FullscreenSpinner";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
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
      <Card className="flex flex-col gap-4">
        <h2>Не удалось загрузить статистику</h2>
        <div className="flex items-start gap-3 rounded-2xl border border-rose-300/60 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
          <span className="flex-1">{message}</span>
          <Button
            variant="secondary"
            onClick={() => {
              void Promise.all([
                overviewQuery.refetch(),
                demographicsQuery.refetch(),
                timelineQuery.refetch(),
              ]).catch(() => undefined);
            }}>
            Повторить
          </Button>
        </div>
      </Card>
    );
  }

  if (!overview || !demographics || !timeline) {
    return <p>Нет данных для отображения.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

      <div className="grid gap-4 lg:grid-cols-3">
        <GenderDistributionChart data={genderDistribution} />
        <FitnessDistributionChart data={overview.fitnessDistribution} />
        {[
          { title: "Популярные форматы", items: topFormats },
          { title: "Популярные цели", items: topGoals },
          { title: "Возрастные группы", items: demographics.ageBuckets },
        ].map((block) => (
          <Card key={block.title} className="flex flex-col gap-4">
            <h2>{block.title}</h2>
            <div className="flex flex-col gap-3">
              {block.items.length ? (
                block.items.map((it: any) => (
                  <div
                    key={it.key ?? it.label}
                    className="flex items-center justify-between rounded-2xl bg-slate-100/60 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
                    <span>{it.label ?? it.label}</span>
                    <strong className="text-base text-slate-900 dark:text-white">
                      {it.count ?? "—"}
                    </strong>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between rounded-2xl bg-slate-100/60 px-4 py-3 text-sm text-slate-400 dark:bg-slate-800/50 dark:text-slate-500">
                  <span>Пока нет данных</span>
                  <strong>—</strong>
                </div>
              )}
            </div>
          </Card>
        ))}

        <Card className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2>Динамика опросов</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Количество заполненных анкет по выбранному диапазону
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {[7, 30, 90].map((value) => (
                <Button
                  key={value}
                  variant={value === rangeDays ? "primary" : "secondary"}
                  size="sm"
                  className="w-full"
                  onClick={() => setRangeDays(value)}>
                  {value} дн.
                </Button>
              ))}
            </div>
          </div>
          <TimelineChart points={timelinePoints} />
        </Card>
      </div>
    </div>
  );
}
