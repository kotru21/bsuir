import {
  translateFitnessLevel,
  translateGenderSingle,
  translateGoal,
  translateTrainingFormat,
} from "../localization";
import { useState } from "react";
import type { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubmissions } from "../api/stats";
import { FullscreenSpinner } from "../components/FullscreenSpinner";
import type { SubmissionListItem } from "../types/stats";

const PAGE_SIZE = 20;

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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["submissions", page],
    queryFn: () => fetchSubmissions(page, PAGE_SIZE),
    staleTime: 30_000,
  });

  if (isLoading && !data) {
    return <FullscreenSpinner message="Загружаем ответы..." />;
  }

  if (isError && !data) {
    const message = getErrorMessage(error);
    return (
      <div className="card">
        <h2>Не удалось загрузить ответы</h2>
        <div className="status-message status-message--error">
          <span className="status-message__text">{message}</span>
          <button
            className="button button--secondary"
            onClick={() => {
              void refetch().catch(() => undefined);
            }}>
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  if (!data || !data.items.length) {
    return <p>Ответы опросов пока отсутствуют.</p>;
  }

  const { items, pagination } = data;
  const transientError = isError ? getErrorMessage(error) : null;

  return (
    <div className="card">
      <h2>Ответы пользователей</h2>
      {transientError ? (
        <div className="status-message status-message--error">
          <span className="status-message__text">
            {transientError} Обновите страницу позже.
          </span>
          <button
            className="button button--secondary"
            onClick={() => {
              void refetch().catch(() => undefined);
            }}>
            Повторить попытку
          </button>
        </div>
      ) : null}
      {isFetching ? <p>Обновляем данные...</p> : null}
      <table className="table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Профиль</th>
            <th>Предпочтения</th>
            <th>Рекомендации</th>
            <th>Пояснение AI</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: SubmissionListItem) => (
            <tr key={item.id}>
              <td>{new Date(item.createdAt).toLocaleString("ru-RU")}</td>
              <td>
                <div>Возраст: {item.profile.age}</div>
                <div>Пол: {translateGenderSingle(item.profile.gender)}</div>
                <div>
                  Подготовка: {translateFitnessLevel(item.profile.fitnessLevel)}
                </div>
                <div>
                  Контакт:{" "}
                  {item.profile.avoidContact ? "Избегает" : "Допускает"}
                </div>
                <div>
                  Соревнования:{" "}
                  {item.profile.interestedInCompetition ? "Да" : "Нет"}
                </div>
              </td>
              <td>
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
              </td>
              <td>
                {item.recommendations.slice(0, 3).map((rec, index) => (
                  <div key={rec.sectionId}>
                    #{index + 1} {rec.sectionName} ({rec.score.toFixed(1)})
                  </div>
                ))}
              </td>
              <td>
                {item.aiSummary
                  ? (() => {
                      const lines = normalizeAiSummary(item.aiSummary);
                      const isExpanded = expandedRows.has(item.id);
                      if (isExpanded) {
                        return (
                          <div>
                            {lines.map((line, idx) => (
                              <p key={`${item.id}-summary-${idx}`}>{line}</p>
                            ))}
                            <button
                              className="button button--secondary"
                              onClick={() => {
                                const next = new Set(expandedRows);
                                next.delete(item.id);
                                setExpandedRows(next);
                              }}
                              aria-label="Свернуть">
                              Скрыть
                            </button>
                          </div>
                        );
                      }

                      const preview = buildPreview(lines, 12);
                      return (
                        <div>
                          <p>{preview}</p>
                          {preview !== lines.join(" ") ? (
                            <button
                              className="button button--secondary"
                              onClick={() => {
                                const next = new Set(expandedRows);
                                next.add(item.id);
                                setExpandedRows(next);
                              }}
                              aria-label="Показать полностью">
                              Показать
                            </button>
                          ) : null}
                        </div>
                      );
                    })()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <span>
          Страница {pagination.page} из {pagination.totalPages} (всего{" "}
          {pagination.total})
        </span>
        <div>
          <button
            className="button button--secondary"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={pagination.page === 1}>
            Назад
          </button>
          <button
            className="button button--secondary"
            onClick={() =>
              setPage((prev) =>
                prev < pagination.totalPages ? prev + 1 : pagination.totalPages
              )
            }
            disabled={pagination.page >= pagination.totalPages}>
            Далее
          </button>
        </div>
      </div>
    </div>
  );
}
