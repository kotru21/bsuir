import React from "react";
import { describe, expect, it, beforeEach, afterEach, vi } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";

import useSidebarCollapsed from "../../admin/web/src/hooks/useSidebarCollapsed.js";

function TestComponent({
  initialKey = "sidebarCollapsed",
}: {
  initialKey?: string;
}) {
  const { collapsed, toggle } = useSidebarCollapsed(initialKey);
  return (
    <div>
      <div data-testid="collapsed">{collapsed ? "1" : "0"}</div>
      <button onClick={() => void toggle()} data-testid="toggle">
        toggle
      </button>
    </div>
  );
}

describe("useSidebarCollapsed", () => {
  beforeEach(() => {
    // ensure a clean storage before every test
    try {
      localStorage.clear();
    } catch (_e) {
      // ignore
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reads initial value from localStorage", () => {
    localStorage.setItem("sidebarCollapsed", "1");
    render(<TestComponent />);
    expect(screen.getByTestId("collapsed").textContent).toBe("1");
  });

  it("writes value to localStorage on toggle", () => {
    render(<TestComponent />);
    const collapsed = screen.getByTestId("collapsed");
    expect(collapsed.textContent).toBe("0");
    fireEvent.click(screen.getByTestId("toggle"));
    expect(collapsed.textContent).toBe("1");
    expect(localStorage.getItem("sidebarCollapsed")).toBe("1");
  });

  it("handles localStorage errors gracefully", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("nope");
    });
    // should not throw
    render(<TestComponent />);
    expect(screen.getByTestId("collapsed").textContent).toBe("0");
  });
});
