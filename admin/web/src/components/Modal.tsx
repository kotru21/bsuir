import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onClick={onClose}>
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-elevated backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70"
        onClick={(e) => e.stopPropagation()}>
        <div className="max-h-[60vh] overflow-y-auto text-sm leading-relaxed text-slate-700 dark:text-slate-200">
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
