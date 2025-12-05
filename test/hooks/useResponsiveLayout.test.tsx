import React from "react";
import { describe, it, expect, beforeEach } from "bun:test";
import { render, screen } from "@testing-library/react";
import useResponsiveLayout from "../../admin/web/src/hooks/useResponsiveLayout.js";

function TestComponent() {
  const { viewportWidth, isMobileViewport, showMobileLabels } =
    useResponsiveLayout();
  return (
    <div>
      <div data-testid="width">{viewportWidth}</div>
      <div data-testid="mobile">{isMobileViewport ? "1" : "0"}</div>
      <div data-testid="labels">{showMobileLabels ? "1" : "0"}</div>
      <div data-testid="hide">
        {isMobileViewport && !showMobileLabels ? "1" : "0"}
      </div>
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
    // At 400px we are below the new mobile label threshold of 420px — labels
    // should be hidden and hide==1.
    expect(screen.getByTestId("labels").textContent).toBe("0");
    expect(screen.getByTestId("hide").textContent).toBe("1");
  });

  it("shows logout text at threshold", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 550,
      writable: true,
      configurable: true,
    });
    window.dispatchEvent(new Event("resize"));
    render(<TestComponent />);
    // At 550px we hit the mobile label threshold — we're in mobile view but
    // labels should be visible (showMobileLabels=true), so hide==0.
    expect(screen.getByTestId("hide").textContent).toBe("0");
  });

  it("does not hide logout text on desktop sizes even if above the hide threshold", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1200,
      writable: true,
      configurable: true,
    });
    window.dispatchEvent(new Event("resize"));
    render(<TestComponent />);
    // 1200px is desktop view; logout text should be visible
    expect(screen.getByTestId("mobile").textContent).toBe("0");
    expect(screen.getByTestId("hide").textContent).toBe("0");
  });
});
