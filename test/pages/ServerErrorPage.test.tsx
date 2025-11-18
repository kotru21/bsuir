import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ServerErrorPage } from "../../admin/web/src/pages/ServerErrorPage.js";

describe("ServerErrorPage", () => {
  it("renders message and calls onReset", () => {
    const onReset = vi.fn();
    render(
      <MemoryRouter>
        <ServerErrorPage onReset={onReset} />
      </MemoryRouter>
    );

    expect(screen.getByText("Внутренняя ошибка сервера")).toBeTruthy();

    const retry = screen.getByRole("button", { name: /Попробовать снова/i });
    fireEvent.click(retry);

    expect(onReset).toHaveBeenCalled();
  });
});
