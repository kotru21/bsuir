import type { ReactElement } from "react";
import { cn } from "../../lib/cn";
import { LogoutIcon } from "../icons/LogoutIcon.js";

export type LogoutButtonProps = {
  onLogout: () => void;
  logoutInProgress?: boolean;
  isIconOnly?: boolean;
  isMobileViewport?: boolean;
};

export function LogoutButton({
  onLogout,
  logoutInProgress = false,
  isIconOnly = false,
  isMobileViewport = false,
}: LogoutButtonProps): ReactElement {
  return (
    <button
      onClick={onLogout}
      disabled={logoutInProgress}
      aria-label={isIconOnly ? "Выйти из аккаунта" : undefined}
      className={cn(
        "group relative flex items-center rounded-2xl text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/70",
        "cursor-pointer",
        "disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500",
        isIconOnly
          ? "h-12 w-12 justify-center p-0 mx-auto"
          : isMobileViewport
          ? "gap-3 px-3 py-2"
          : "w-full gap-3 px-4 py-3"
      )}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200/70 text-slate-600 transition-colors duration-200 group-hover:bg-rose-100 group-hover:text-rose-600 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-rose-500/20 dark:group-hover:text-rose-200">
        <LogoutIcon className="h-4 w-4" aria-hidden />
      </span>

      {!isIconOnly && (
        <span className="whitespace-nowrap text-sm font-medium overflow-hidden flex-1 text-left">
          <span
            className="block transition-all duration-300 ease-in-out"
            style={{
              opacity: isIconOnly ? 0 : 1,
              transform: isIconOnly ? "translateX(-10px)" : "translateX(0)",
              transitionDelay: isIconOnly ? "0ms" : "100ms",
            }}>
            {logoutInProgress ? "Выходим..." : "Выйти"}
          </span>
        </span>
      )}
    </button>
  );
}

export default LogoutButton;
