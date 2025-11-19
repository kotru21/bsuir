import type { ReactElement } from "react";
import { Button } from "../Button.js";

export type TopbarProps = {
  username?: string | null;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  isMobileViewport: boolean;
};

export function Topbar({
  username,
  collapsed,
  onToggleCollapsed,
  isMobileViewport,
}: TopbarProps): ReactElement {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/60 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700/60">
      <div className="flex flex-col gap-1">
        <h1>Контрольная панель</h1>
        {username ? (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Вошел: {username}
          </span>
        ) : null}
      </div>
      {!isMobileViewport ? (
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          aria-pressed={!collapsed}
          aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}>
          {collapsed ? "Раскрыть меню" : "Свернуть меню"}
        </Button>
      ) : null}
    </header>
  );
}

export default Topbar;
