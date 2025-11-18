import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PublicNotFoundPage } from "../../admin/web/src/pages/PublicNotFoundPage.js";

describe("PublicNotFoundPage", () => {
  it("renders without admin layout for not authenticated users", () => {
    render(
      <MemoryRouter>
        <PublicNotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Страница не найдена")).toBeTruthy();
    // Layout header should not be present
    expect(screen.queryByText("Контрольная панель")).toBeNull();
  });
});
