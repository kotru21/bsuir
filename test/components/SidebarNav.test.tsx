import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SidebarNav from "../../admin/web/src/components/layout/SidebarNav.js";

const navItems = [
  { to: "/", label: "Home", icon: () => null },
  { to: "/posts", label: "Posts", icon: () => null },
];

describe("SidebarNav", () => {
  it("renders nav items", () => {
    render(
      <MemoryRouter>
        <SidebarNav
          navItems={navItems}
          isIconOnly={false}
          isMobileViewport={false}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Posts")).toBeDefined();
  });

  it("provides aria-label when icon-only", () => {
    render(
      <MemoryRouter>
        <SidebarNav
          navItems={navItems}
          isIconOnly={true}
          isMobileViewport={false}
        />
      </MemoryRouter>
    );
    // NavLinks should have aria-label when icon-only
    const links = screen.getAllByRole("link");
    links.forEach((link) =>
      expect(link.getAttribute("aria-label")).toBeTruthy()
    );
  });
});
