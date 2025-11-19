import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import useResponsiveLayout from "../../admin/web/src/hooks/useResponsiveLayout.js";

function TestComponent() {
  const { viewportWidth, isMobileViewport, showMobileLabels, hideLogoutText } =
    useResponsiveLayout();
  return (
    <div>
      <div data-testid="width">{viewportWidth}</div>
      <div data-testid="mobile">{isMobileViewport ? "1" : "0"}</div>
      <div data-testid="labels">{showMobileLabels ? "1" : "0"}</div>
      <div data-testid="hide">{hideLogoutText ? "1" : "0"}</div>
    </div>
  );
}

describe("useResponsiveLayout", () => {
  beforeEach(() => {
    // reset width
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
      configurable: true,
    });
    window.dispatchEvent(new Event("resize"));
  });

  it("computes mobile flags correctly", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 400,
      writable: true,
      configurable: true,
    });
    window.dispatchEvent(new Event("resize"));
    render(<TestComponent />);

    expect(screen.getByTestId("mobile").textContent).toBe("1");
    expect(screen.getByTestId("labels").textContent).toBe("1");
    expect(screen.getByTestId("hide").textContent).toBe("0");
  });

  it("hides logout text under threshold", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 420,
      writable: true,
      configurable: true,
    });
    window.dispatchEvent(new Event("resize"));
    render(<TestComponent />);
    expect(screen.getByTestId("hide").textContent).toBe("1");
  });
});
