import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { usePagination } from "../../admin/web/src/hooks/usePagination.js";

function TestComp({ initial = 1 }: { initial?: number }) {
  const pagination = usePagination({ initial });
  return (
    <div>
      <div data-testid="page">{pagination.page}</div>
      <button onClick={pagination.nextPage}>next</button>
      <button onClick={pagination.prevPage}>prev</button>
      <button onClick={() => pagination.setTotalPages(3)}>set-total</button>
      <button onClick={() => pagination.setPage(5)}>set-page</button>
    </div>
  );
}

describe("usePagination", () => {
  it("initial page and navigation", () => {
    render(<TestComp initial={1} />);

    expect(screen.getByTestId("page").textContent).toBe("1");
    fireEvent.click(screen.getByText(/next/i));
    expect(screen.getByTestId("page").textContent).toBe("2");
    fireEvent.click(screen.getByText(/prev/i));
    expect(screen.getByTestId("page").textContent).toBe("1");
    fireEvent.click(screen.getByText(/set-page/i));
    expect(screen.getByTestId("page").textContent).toBe("5");
  });

  it("respects total pages when advancing", () => {
    render(<TestComp initial={1} />);
    expect(screen.getByTestId("page").textContent).toBe("1");
    fireEvent.click(screen.getByText(/set-total/i));
    fireEvent.click(screen.getByText(/next/i));
    expect(screen.getByTestId("page").textContent).toBe("2");
    fireEvent.click(screen.getByText(/next/i));
    expect(screen.getByTestId("page").textContent).toBe("3");
    fireEvent.click(screen.getByText(/next/i));
    expect(screen.getByTestId("page").textContent).toBe("3");
  });
});
