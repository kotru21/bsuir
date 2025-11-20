import React from "react";
import { describe, it, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import SidebarLogo from "../../admin/web/src/components/layout/SidebarLogo.js";

describe("SidebarLogo", () => {
  it("renders logo and label when not collapsed", () => {
    render(<SidebarLogo collapsed={false} />);
    expect(screen.getByAltText("Логотип")).toBeDefined();
    expect(screen.getByText("BSUIR Sports")).toBeDefined();
  });

  it("hides text when collapsed", () => {
    render(<SidebarLogo collapsed={true} />);
    expect(screen.getByAltText("Логотип")).toBeDefined();
    expect(screen.queryByText("BSUIR Sports")).toBeNull();
  });
});
