import React from "react";
import { describe, it, expect, vi } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import LogoutButton from "../../admin/web/src/components/layout/LogoutButton.js";

describe("LogoutButton", () => {
  it("renders text when not icon-only", () => {
    render(<LogoutButton onLogout={() => {}} />);
    expect(screen.getByText("Выйти")).toBeTruthy();
  });

  it("calls onLogout when clicked", () => {
    const onLogout = vi.fn();
    render(<LogoutButton onLogout={onLogout} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onLogout).toHaveBeenCalled();
  });

  it("is disabled when logoutInProgress is true", () => {
    const onLogout = vi.fn();
    render(<LogoutButton onLogout={onLogout} logoutInProgress />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
