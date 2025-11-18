import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../admin/web/src/auth/AuthProvider.js";
import { Layout } from "../../admin/web/src/components/Layout.js";
import { NotFoundPage } from "../../admin/web/src/pages/NotFoundPage.js";

describe("NotFoundPage", () => {
  it("renders title and navigation links", async () => {
    // Mock network requests used by AuthProvider
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
            JSON.stringify({ authenticated: true, username: "u" }),
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
          <Layout>
            <NotFoundPage />
          </Layout>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText("Страница не найдена")).toBeTruthy();
    expect(await screen.findByText(/Страница, которую вы ищете/)).toBeTruthy();

    // Find button label and ensure it is wrapped in a link
    const goHomeButton = screen.getByText("На главную");
    expect(goHomeButton).toBeTruthy();
    const parentLink = goHomeButton.closest("a");
    expect(parentLink).toBeTruthy();
    expect(parentLink?.getAttribute("href")).toBe("/");
  });
});
