import { useState, useCallback } from "react";
import type { ReactElement } from "react";
import { Button } from "./Button";

export type ExportFormat = "json" | "csv" | "xlsx";

export type ExportFile = { blob: Blob; filename?: string | null; contentType?: string | null };
export type ExportHandler = (format: ExportFormat) => Promise<ExportFile>;

export interface ExportMenuProps {
  onExport: ExportHandler;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
}

export function ExportMenu({
  onExport,
  label = "Экспорт",
  size = "sm",
  variant = "primary",
  disabled = false,
  className,
}: ExportMenuProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const doExport = useCallback(
    async (format: ExportFormat) => {
      setOpen(false);
      setIsExporting(true);
      try {
        const { blob, filename } = await onExport(format);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename ?? `export.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (_err) {
        void alert("Не удалось выполнить экспорт. Попробуйте позже.");
      } finally {
        setIsExporting(false);
      }
    },
    [onExport]
  );

  return (
    <div className={className}>
      <div className="relative">
        <Button
          variant={variant}
          size={size}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          disabled={disabled || isExporting}
        >
          {isExporting ? "Экспорт..." : label}
        </Button>
        {open ? (
          <div className="absolute right-0 mt-2 w-40 rounded-md bg-white p-2 shadow-md z-20 dark:bg-slate-800">
            <button
              className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => void doExport("json")}
            >
              JSON
            </button>
            <button
              className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => void doExport("csv")}
            >
              CSV
            </button>
            <button
              className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => void doExport("xlsx")}
            >
              XLSX
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
