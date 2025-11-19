import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import useResponsiveLayout from "../admin/web/src/hooks/useResponsiveLayout.js";

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
    (window as any).innerWidth = 1024;
    window.dispatchEvent(new Event("resize"));
  });

  it("computes mobile flags correctly", () => {
    (window as any).innerWidth = 400; // >350 and <1024
    window.dispatchEvent(new Event("resize"));
    render(<TestComponent />);

    expect(screen.getByTestId("mobile").textContent).toBe("1");
    expect(screen.getByTestId("labels").textContent).toBe("1");
    expect(screen.getByTestId("hide").textContent).toBe("0");
  });

  it("hides logout text under threshold", () => {
    (window as any).innerWidth = 420;
    window.dispatchEvent(new Event("resize"));
    render(<TestComponent />);
    expect(screen.getByTestId("hide").textContent).toBe("1");
  });
});
