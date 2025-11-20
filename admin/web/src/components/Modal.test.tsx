import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";
import { describe, it, expect, vi } from "bun:test";

describe("Modal accessibility", () => {
  it("sets aria-hidden on main while open and removes on close", async () => {
    const main = document.createElement("main");
    main.textContent = "content";
    document.body.appendChild(main);

    const { rerender } = render(
      <>
        <main />
        <Modal open={true} onClose={() => {}} titleId="t1" descriptionId="d1">
          <div id="d1">Hello</div>
        </Modal>
      </>
    );

    expect(document.querySelector("main")?.getAttribute("aria-hidden")).toBe(
      "true"
    );

    // close modal via rerender
    rerender(
      <>
        <main />
        <Modal open={false} onClose={() => {}} titleId="t1" descriptionId="d1">
          <div id="d1">Hello</div>
        </Modal>
      </>
    );

    expect(
      document.querySelector("main")?.getAttribute("aria-hidden")
    ).toBeNull();
  });

  it("renders a dialog role and is closable with Escape key", () => {
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} titleId="t2" descriptionId="d2">
        <div id="d2">Hello</div>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeDefined();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
