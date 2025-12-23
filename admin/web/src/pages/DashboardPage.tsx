import { useState, Suspense, lazy, useCallback } from "react";
import type { ReactElement } from "react";
import { useOverviewStats } from "../hooks/useOverviewStats";
import { ErrorCard } from "../components/ErrorCard";
import { MetricCard } from "../components/MetricCard";
const GenderDistributionChart = lazy(() =>
  import("../components/GenderDistributionChart").then((m) => ({
    default: m.GenderDistributionChart,
  }))
);

const FitnessDistributionChart = lazy(() =>
  import("../components/FitnessDistributionChart").then((m) => ({
    default: m.FitnessDistributionChart,
  }))
);

const TimelineChart = lazy(() =>
  import("../components/TimelineChart").then((m) => ({
    default: m.TimelineChart,
  }))
);
import { FullscreenSpinner } from "../components/FullscreenSpinner";
import { Button } from "../components/Button";
import { exportOverview } from "../api/stats";
import { Card } from "../components/Card";
// translation logic moved to hook

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

  const handleRangeClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const val = Number(e.currentTarget.getAttribute("data-range") ?? 30);
      setRangeDays(val);
    },
    []
  );

  const {
    overview,
    demographics,
    timeline,
    timelinePoints,
    genderDistribution,
    topFormats,
    topGoals,
    loading,
    isError,
    error,
    refetchAll,
  } = useOverviewStats(rangeDays);

  const [exportOpen, setExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);



  if (loading) {
    return <FullscreenSpinner message="Загружаем статистику..." />;
  }

  if (isError) {
    return (
      <ErrorCard
        title="Не удалось загрузить статистику"
        message={getErrorMessage(error)}
        onRetry={() => {
          void refetchAll().catch(() => undefined);
        }}
      />
    );
  }

  if (!overview || !demographics || !timeline) {
    return <p>Нет данных для отображения.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Статистика</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Обзор по опросам</p>
        </div>
        <div className="relative">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setExportOpen((v) => !v)}
            aria-expanded={exportOpen}
            aria-haspopup="menu"
            disabled={isExporting}
          >
            {isExporting ? "Экспорт..." : "Экспорт"}
          </Button>
          {exportOpen ? (
            <div className="absolute right-0 mt-2 w-40 rounded-md border-slate-200/70 bg-white/90 shadow-elevated backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70 p-2 shadow-md z-20">
              <button
                className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-slate-100/20"
                onClick={() => {
                  void (async () => {
                    setExportOpen(false);
                    setIsExporting(true);
                    try {
                      const { blob, filename } = await exportOverview("json");
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = filename ?? "overview.json";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    } catch (_err) {
                      void alert("Не удалось экспортировать статистику. Попробуйте позже.");
                    } finally {
                      setIsExporting(false);
                    }
                  })();
                }}
              >
                JSON
              </button>
              <button
                className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-slate-100"
                onClick={() => {
                  void (async () => {
                    setExportOpen(false);
                    setIsExporting(true);
                    try {
                      const { blob, filename } = await exportOverview("csv");
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = filename ?? "overview.csv";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    } catch (_err) {
                      void alert("Не удалось экспортировать статистику. Попробуйте позже.");
                    } finally {
                      setIsExporting(false);
                    }
                  })();
                }}
              >
                CSV
              </button>
              <button
                className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-slate-100"
                onClick={() => {
                  void (async () => {
                    setExportOpen(false);
                    setIsExporting(true);
                    try {
                      const { blob, filename } = await exportOverview("xlsx");
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = filename ?? "overview.xlsx";
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      URL.revokeObjectURL(url);
                    } catch (_err) {
                      void alert("Не удалось экспортировать статистику. Попробуйте позже.");
                    } finally {
                      setIsExporting(false);
                    }
                  })();
                }}
              >
                XLSX
              </button>
            </div>
          ) : null}
        </div>
      </div>

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
        <Suspense
          fallback={<FullscreenSpinner message="Загружаем график..." />}>
          <GenderDistributionChart data={genderDistribution} />
        </Suspense>
        <Suspense
          fallback={<FullscreenSpinner message="Загружаем график..." />}>
          <FitnessDistributionChart data={overview.fitnessDistribution} />
        </Suspense>
        {[
          { title: "Популярные форматы", items: topFormats },
          { title: "Популярные цели", items: topGoals },
          { title: "Возрастные группы", items: demographics.ageBuckets },
        ].map((block) => (
          <Card key={block.title} className="flex flex-col gap-4">
            <h2>{block.title}</h2>
            <div className="flex flex-col gap-3">
              {block.items.length ? (
                block.items.map(
                  (it: { key?: string; label?: string; count?: number }) => (
                    <div
                      key={it.key ?? it.label}
                      className="flex items-center justify-between rounded-2xl bg-slate-100/60 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800/50 dark:text-slate-200">
                      <span>{it.label ?? it.label}</span>
                      <strong className="text-base text-slate-900 dark:text-white">
                        {it.count ?? "—"}
                      </strong>
                    </div>
                  )
                )
              ) : (
                <div className="flex items-center justify-between rounded-2xl bg-slate-100/60 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800/50 dark:text-slate-500">
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
                  onClick={handleRangeClick}
                  data-range={value}>
                  {value} дн.
                </Button>
              ))}
            </div>
          </div>
          <Suspense
            fallback={<FullscreenSpinner message="Загружаем график..." />}>
            <TimelineChart
              points={timelinePoints}
              title="Динамика опросов по выбранному диапазону"
            />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
