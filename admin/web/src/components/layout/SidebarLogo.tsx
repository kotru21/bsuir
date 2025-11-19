import type { ReactElement } from "react";
import logoUrl from "../../assets/logo.png";

export type SidebarLogoProps = {
  collapsed: boolean;
};

export function SidebarLogo({ collapsed }: SidebarLogoProps): ReactElement {
  return (
    <div className="flex items-center gap-4 shrink-0">
      <img
        src={logoUrl}
        alt="Логотип"
        className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200/60 bg-white/80 p-2 shadow-sm dark:border-slate-700/60 dark:bg-slate-950"
      />
      {!collapsed && (
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="transition-all duration-300 ease-in-out">
            <span className="block whitespace-nowrap text-sm font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              BSUIR Sports
            </span>
            <strong className="block whitespace-nowrap text-lg text-slate-900 dark:text-slate-100">
              Админ-панель
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default SidebarLogo;
