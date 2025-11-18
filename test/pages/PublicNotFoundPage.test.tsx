import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotFoundPage } from "../../admin/web/src/pages/NotFoundPage.js";
import { AuthProvider } from "../../admin/web/src/auth/AuthProvider.js";

describe("NotFoundPage (public)", () => {
  it("renders without admin layout for not authenticated users", async () => {
    // Mock network requests used by AuthProvider (not authenticated)
    global.fetch = vi.fn(async (url: string) => {
      if ((url as string).endsWith("/csrf")) {
        return {
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ token: "abc" }),
        } as unknown as Response;
      }
      if ((url as string).endsWith("/session")) {
        return {
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify({ authenticated: false, username: null }),
        } as unknown as Response;
      }
      return {
        ok: true,
        status: 200,
        text: async () => "{}",
      } as unknown as Response;
    });
    render(
      <MemoryRouter>
        <AuthProvider>
          <NotFoundPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText("Страница не найдена")).toBeTruthy();
    // Layout header should not be present
    expect(screen.queryByText("Контрольная панель")).toBeNull();
  });
});
