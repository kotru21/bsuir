import { useCallback, useState } from "react";

export function usePagination({ initial = 1, total = undefined } = {}) {
  const [page, setPage] = useState<number>(initial);
  const [totalPages, setTotalPages] = useState<number | undefined>(total);

  const setTotal = useCallback((t?: number) => setTotalPages(t), []);

  const nextPage = useCallback(() => {
    setPage((prev) => {
      if (!totalPages) return prev + 1;
      return prev < totalPages ? prev + 1 : prev;
    });
  }, [totalPages]);

  const prevPage = useCallback(
    () => setPage((prev) => Math.max(1, prev - 1)),
    []
  );

  const setPageTo = useCallback((p: number) => setPage(Math.max(1, p)), []);

  return {
    page,
    setPage: setPageTo,
    nextPage,
    prevPage,
    totalPages,
    setTotalPages: setTotal,
  } as const;
}
