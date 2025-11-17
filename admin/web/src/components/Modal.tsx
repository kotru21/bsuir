import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  titleId?: string;
  descriptionId?: string;
  ariaLabel?: string;
};

export default function Modal({
  open,
  onClose,
  children,
  titleId,
  descriptionId,
  ariaLabel,
}: ModalProps) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // focus trap and escape handling
  const portalRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;

    // Save the previously focused element to restore on close
    openerRef.current = document.activeElement as HTMLElement | null;

    // mark main content as hidden for screen readers while modal is open
    const main = document.querySelector("main") as HTMLElement | null;
    if (main) main.setAttribute("aria-hidden", "true");

    const root = dialogRef.current ?? document.body;

    // find focusable elements
    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), details, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(
      root.querySelectorAll(focusableSelector)
    ) as HTMLElement[];

    // focus the first focusable element, or the modal container
    if (focusable.length) {
      focusable[0].focus();
    } else if (root instanceof HTMLElement) {
      root.focus();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        // Keep tab focus within the modal
        const nodes = focusable;
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      // restore focus
      if (openerRef.current) openerRef.current.focus();
      // restore aria-hidden to background content
      const main = document.querySelector("main") as HTMLElement | null;
      if (main) main.removeAttribute("aria-hidden");
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="presentation"
      tabIndex={-1}
      ref={portalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-label={titleId ? undefined : ariaLabel ?? "Диалог"}
        tabIndex={-1}
        className="relative w-full max-w-2xl rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-elevated backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70"
        onClick={(e) => e.stopPropagation()}>
        <div
          className="max-h-[60vh] overflow-y-auto text-sm leading-relaxed text-slate-700 dark:text-slate-200"
          id={descriptionId}>
          {children}
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
