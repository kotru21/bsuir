import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubmissions } from "../api/stats";
import { FullscreenSpinner } from "../components/FullscreenSpinner";
import type { SubmissionListItem } from "../types/stats";

const PAGE_SIZE = 20;

export function SubmissionsPage(): JSX.Element {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["submissions", page],
    queryFn: () => fetchSubmissions(page, PAGE_SIZE),
    staleTime: 30_000,
  });

  if (isLoading && !data) {
    return <FullscreenSpinner message="Загружаем ответы..." />;
  }

  if (!data || !data.items.length) {
    return <p>Ответы опросов пока отсутствуют.</p>;
  }

  const { items, pagination } = data;

  return (
    <div className="card">
      <h2>Ответы пользователей</h2>
      {isFetching ? <p>Обновляем данные...</p> : null}
      <table className="table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Профиль</th>
            <th>Предпочтения</th>
            <th>Рекомендации</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: SubmissionListItem) => (
            <tr key={item.id}>
              <td>{new Date(item.createdAt).toLocaleString("ru-RU")}</td>
              <td>
                <div>Возраст: {item.profile.age}</div>
                <div>Пол: {item.profile.gender}</div>
                <div>Подготовка: {item.profile.fitnessLevel}</div>
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
                    ? item.profile.preferredFormats.join(", ")
                    : "—"}
                </div>
                <div>
                  Цели:{" "}
                  {item.profile.desiredGoals.length
                    ? item.profile.desiredGoals.join(", ")
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
