import React from "react";
import { describe, it, expect, vi } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { GlobalErrorBoundary } from "../../admin/web/src/components/GlobalErrorBoundary.js";

function Bomb() {
  throw new Error("Boom");
}

describe("GlobalErrorBoundary", () => {
  it("shows ServerErrorPage when a child throws and calls onReset", () => {
    const onReset = vi.fn();

    render(
      <GlobalErrorBoundary onReset={onReset}>
        <Bomb />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText("Внутренняя ошибка сервера")).toBeTruthy();

    const retry = screen.getByRole("button", { name: /Попробовать снова/i });
    fireEvent.click(retry);

    expect(onReset).toHaveBeenCalled();
  });
});
