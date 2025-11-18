import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorCard } from "../../admin/web/src/components/ErrorCard.js";

describe("ErrorCard", () => {
  it("renders title and message and calls onRetry", () => {
    const onRetry = vi.fn();
    render(
      <ErrorCard title="Oops" message="Something failed" onRetry={onRetry} />
    );
    expect(screen.getByText("Oops")).toBeTruthy();
    expect(screen.getByText("Something failed")).toBeTruthy();
    const button = screen.getByRole("button", { name: /повторить/i });
    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalled();
  });

  it("supports warning variant", () => {
    render(
      <ErrorCard title="Warn" message="Try again later" variant="warning" />
    );
    expect(screen.getByText("Warn")).toBeTruthy();
    expect(screen.getByText("Try again later")).toBeTruthy();
  });
});
