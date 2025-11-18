import {
  translateFitnessLevel,
  translateGenderSingle,
  translateGoal,
  translateTrainingFormat,
} from "../localization";
import { useId, useMemo, useState, useCallback } from "react";
import type { ReactElement } from "react";
import Modal from "../components/Modal";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useQuery } from "@tanstack/react-query";
import { fetchSubmissions } from "../api/stats";
import { FullscreenSpinner } from "../components/FullscreenSpinner";
import type { SubmissionListItem } from "../types/stats";

const PAGE_SIZE = 20;

type SubmissionWithSummary = SubmissionListItem & {
  summaryLines: string[];
  summaryPreview: string | null;
  summaryFullText: string | null;
};

/* eslint-disable no-useless-escape */
function normalizeAiSummary(summary: string): string[] {
  if (!summary.trim()) {
    return [];
  }

  const unescaped = summary.replace(/\\([_\-*\[\]()~`>#\+=|{}.!\\])/g, "$1");
  const withoutMarkdown = unescaped
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1");

  return withoutMarkdown
    .split(/\n+/)
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}
/* eslint-enable no-useless-escape */

function buildPreview(summaryLines: string[], maxWords = 12): string {
  const joined = summaryLines.join(" ");
  const words = joined.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return joined;
  return words.slice(0, maxWords).join(" ") + "…";
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Не удалось загрузить ответы. Попробуйте еще раз.";
}

export function SubmissionsPage(): ReactElement {
  const [page, setPage] = useState(1);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const closeModal = useCallback(() => setModalContent(null), []);
  const modalTitleId = useId();
  const modalDescriptionId = useId();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["submissions", page],
    queryFn: () => fetchSubmissions(page, PAGE_SIZE),
    staleTime: 30_000,
  });

  // stable pagination handlers must be declared unconditionally (hook rules)
  const totalPages = data?.pagination?.totalPages ?? 1;
  const prevPage = useCallback(
    () => setPage((prev) => Math.max(1, prev - 1)),
    []
  );
  const nextPage = useCallback(
    () => setPage((prev) => (prev < totalPages ? prev + 1 : totalPages)),
    [totalPages]
  );

  const processedItems = useMemo<SubmissionWithSummary[]>(() => {
    if (!data?.items) {
      return [];
    }
    return data.items.map((item) => {
      const lines = item.aiSummary ? normalizeAiSummary(item.aiSummary) : [];
      const preview = lines.length ? buildPreview(lines, 12) : null;
      const fullText = lines.length ? lines.join(" ") : null;
      return {
        ...item,
        summaryLines: lines,
        summaryPreview: preview,
        summaryFullText: fullText,
      };
    });
  }, [data]);

  if (isLoading && !data) {
    return <FullscreenSpinner message="Загружаем ответы..." />;
  }

  if (isError && !data) {
    const message = getErrorMessage(error);
    return (
      <Card className="flex flex-col gap-4">
        <h2>Не удалось загрузить ответы</h2>
        <div className="flex items-start gap-3 rounded-2xl border border-rose-300/60 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
          <span className="flex-1">{message}</span>
          <Button
            variant="secondary"
            onClick={() => {
              void refetch().catch(() => undefined);
            }}>
            Повторить
          </Button>
        </div>
      </Card>
    );
  }

  if (!data || !data.items.length) {
    return <p>Ответы опросов пока отсутствуют.</p>;
  }

  const { pagination } = data;
  const transientError = isError ? getErrorMessage(error) : null;

  return (
    <Card className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2>Ответы пользователей</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          История поданных анкет с ключевыми параметрами и пояснениями AI
        </p>
      </div>
      {transientError ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/60 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-200">
          <span className="flex-1">
            {transientError} Обновите страницу позже.
          </span>
          <Button
            variant="secondary"
            onClick={() => {
              void refetch().catch(() => undefined);
            }}>
            Повторить
          </Button>
        </div>
      ) : null}
      {isFetching ? (
        <p
          className="text-sm text-slate-500 dark:text-slate-400"
          role="status"
          aria-live="polite">
          Обновляем данные...
        </p>
      ) : null}
      <div className="-mx-4 overflow-x-auto lg:-mx-6">
        <table
          className="min-w-[720px] w-full border-collapse text-sm"
          aria-describedby="submissionsTableCaption">
          <caption id="submissionsTableCaption" className="sr-only">
            История анкет с параметрами профиля и пояснениями AI
          </caption>
          <thead className="text-left uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            <tr>
              <th
                scope="col"
                className="border-b border-slate-200/70 px-4 py-3 dark:border-slate-700/60">
                Дата
              </th>
              <th
                scope="col"
                className="border-b border-slate-200/70 px-4 py-3 dark:border-slate-700/60">
                Профиль
              </th>
              <th
                scope="col"
                className="border-b border-slate-200/70 px-4 py-3 dark:border-slate-700/60">
                Предпочтения
              </th>
              <th
                scope="col"
                className="border-b border-slate-200/70 px-4 py-3 dark:border-slate-700/60">
                Рекомендации
              </th>
              <th
                scope="col"
                className="border-b border-slate-200/70 px-4 py-3 dark:border-slate-700/60">
                Пояснение AI
              </th>
            </tr>
          </thead>
          <tbody className="align-top text-slate-700 dark:text-slate-200">
            {processedItems.map((item) => (
              <tr
                key={item.id}
                className="odd:bg-slate-50/60 dark:odd:bg-slate-900/40">
                <th
                  scope="row"
                  className="border-b border-slate-200/60 px-4 py-4 text-sm font-medium text-slate-600 dark:border-slate-800 dark:text-slate-300">
                  {new Date(item.createdAt).toLocaleString("ru-RU")}
                </th>
                <td className="border-b border-slate-200/60 px-4 py-4 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="font-medium text-slate-900 dark:text-white">
                      Возраст: {item.profile.age}
                    </div>
                    <div>Пол: {translateGenderSingle(item.profile.gender)}</div>
                    <div>
                      Подготовка:{" "}
                      {translateFitnessLevel(item.profile.fitnessLevel)}
                    </div>
                    <div>
                      Контакт:{" "}
                      {item.profile.avoidContact ? "Избегает" : "Допускает"}
                    </div>
                    <div>
                      Соревнования:{" "}
                      {item.profile.interestedInCompetition ? "Да" : "Нет"}
                    </div>
                  </div>
                </td>
                <td className="border-b border-slate-200/60 px-4 py-4 dark:border-slate-800">
                  <div className="space-y-1">
                    <div>
                      Форматы:{" "}
                      {item.profile.preferredFormats.length
                        ? item.profile.preferredFormats
                            .map((format) => translateTrainingFormat(format))
                            .join(", ")
                        : "—"}
                    </div>
                    <div>
                      Цели:{" "}
                      {item.profile.desiredGoals.length
                        ? item.profile.desiredGoals
                            .map((goal) => translateGoal(goal))
                            .join(", ")
                        : "—"}
                    </div>
                  </div>
                </td>
                <td className="border-b border-slate-200/60 px-4 py-4 dark:border-slate-800">
                  <div className="space-y-1">
                    {item.recommendations.slice(0, 3).map((rec, index) => (
                      <div
                        key={rec.sectionId}
                        className="rounded-xl bg-slate-100/70 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                        #{index + 1} {rec.sectionName}
                        <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                          {rec.score.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="border-b border-slate-200/60 px-4 py-4 dark:border-slate-800">
                  {item.summaryLines.length ? (
                    <div className="flex max-w-xs flex-col gap-2">
                      {item.summaryPreview ? (
                        <p
                          className="text-sm text-slate-600 dark:text-slate-200"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}>
                          {item.summaryPreview}
                        </p>
                      ) : null}
                      {item.summaryFullText &&
                      item.summaryPreview !== item.summaryFullText ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            setModalContent(item.summaryLines.join("\n"))
                          }
                          aria-label={`Показать полное пояснение для анкеты ${item.id}`}>
                          Показать
                        </Button>
                      ) : null}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl bg-slate-100/60 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
        <span role="status" aria-live="polite">
          Страница {pagination.page} из {pagination.totalPages} (всего{" "}
          {pagination.total})
        </span>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={prevPage}
            disabled={pagination.page === 1}>
            Назад
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={nextPage}
            disabled={pagination.page >= pagination.totalPages}>
            Далее
          </Button>
        </div>
      </div>
      <Modal
        open={Boolean(modalContent)}
        onClose={closeModal}
        titleId={modalTitleId}
        descriptionId={modalDescriptionId}>
        <div className="flex flex-col gap-4">
          <h3
            id={modalTitleId}
            className="text-lg font-semibold text-slate-900 dark:text-white">
            Полное пояснение AI
          </h3>
          {modalContent ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {modalContent}
            </div>
          ) : null}
        </div>
      </Modal>
    </Card>
  );
}
