import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../../admin/web/src/components/layout/Sidebar.js";

const navItems = [
  { to: "/", label: "Home", icon: () => null },
  { to: "/posts", label: "Posts", icon: () => null },
];

describe("Sidebar", () => {
  it("shows nav items and logo", () => {
    render(
      <MemoryRouter>
        <Sidebar
          navItems={navItems}
          collapsed={false}
          isMobileViewport={false}
          showMobileLabels={true}
          isIconOnly={false}
          hideLogoutText={false}
          onLogout={() => {}}
          logoutInProgress={false}
        />
      </MemoryRouter>
    );

    // Nav items should be visible
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Posts")).toBeDefined();

    // Logo present by alt text
    expect(screen.getByAltText("Логотип")).toBeDefined();
  });
});
