import { useCallback, useEffect, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { useAuth } from "../auth/AuthProvider";
import logoUrl from "../assets/logo.png";
import { StatsIcon } from "./icons/StatsIcon";
import { ViewRespIcon } from "./icons/ViewRespIcon";
import { LogoutIcon } from "./icons/LogoutIcon";
import { cn } from "../lib/cn";
import { Button } from "./Button";
import { useViewportWidth } from "../hooks/useViewportWidth";
import { SidebarNavItem } from "./layout/SidebarNavItem";

const NAV_ITEMS = [
  { to: "/", label: "Обзор", icon: StatsIcon },
  { to: "/submissions", label: "Опросы", icon: ViewRespIcon },
];

const MOBILE_BREAKPOINT_PX = 1024;
const MOBILE_LABEL_BREAKPOINT_PX = 320;

export function Layout({ children }: { children: ReactNode }): ReactElement {
  const auth = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebarCollapsed") === "1";
    } catch (_e) {
      return false;
    }
  });
  const viewportWidth = useViewportWidth();

  useEffect(() => {
    try {
      localStorage.setItem("sidebarCollapsed", collapsed ? "1" : "0");
    } catch (_e) {
      /* ignore */
    }
  }, [collapsed]);

  const isMobileViewport =
    viewportWidth > 0 && viewportWidth < MOBILE_BREAKPOINT_PX;
  const showMobileLabels =
    isMobileViewport && viewportWidth >= MOBILE_LABEL_BREAKPOINT_PX;
  const isIconOnly = isMobileViewport ? !showMobileLabels : collapsed;

  const handleLogout = useCallback(() => {
    void auth.logout();
  }, [auth]);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:items-start">
        <aside
          aria-label="Боковое меню"
          className={cn(
            "rounded-3xl border border-slate-200/70 bg-white/90 shadow-elevated backdrop-blur transition-all duration-300 dark:border-slate-700/60 dark:bg-slate-900/70",
            isMobileViewport
              ? "sticky top-2 z-30 mt-2 flex w-full items-center gap-3 px-3 py-2"
              : cn(
                  "flex min-h-0 flex-col gap-8 p-6",
                  "lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto",
                  collapsed ? "lg:w-24 lg:px-4" : "lg:w-72"
                )
          )}>
          {/* Заголовок с логотипом */}
          {!isMobileViewport ? (
            <div
              className={cn(
                "flex items-center gap-4 shrink-0 transition-all duration-300 ease-in-out",

                collapsed ? "lg:justify-center lg:gap-0 lg:w-full" : ""
              )}>
              <img
                src={logoUrl}
                alt="Логотип"
                className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200/60 bg-white/80 p-2 shadow-sm dark:border-slate-700/60 dark:bg-slate-950"
              />
              <div
                className={cn(
                  "min-w-0 flex-1 overflow-hidden transition-all duration-300 ease-in-out",

                  collapsed
                    ? "lg:max-w-0 lg:opacity-0"
                    : "lg:max-w-full lg:opacity-100"
                )}>
                <span className="block whitespace-nowrap text-sm font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  BSUIR Sports
                </span>
                <strong className="block whitespace-nowrap text-lg text-slate-900 dark:text-slate-100">
                  Админ-панель
                </strong>
              </div>
            </div>
          ) : null}

          {/* Навигация */}
          <nav
            role="navigation"
            aria-label="Основная навигация админ-панели"
            className={cn(
              "shrink-0",
              isMobileViewport
                ? showMobileLabels
                  ? "flex flex-1 flex-wrap items-center justify-between gap-3"
                  : "flex flex-1 items-center justify-between gap-2 overflow-x-auto"
                : "mt-6 flex flex-col items-center gap-2"
            )}>
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <SidebarNavItem
                key={to}
                to={to}
                label={label}
                icon={icon}
                isIconOnly={isIconOnly}
                isMobileViewport={isMobileViewport}
              />
            ))}
          </nav>

          {/* Кнопка выхода */}
          <div
            className={cn(
              "shrink-0",
              isMobileViewport ? "ml-auto" : "mt-auto flex justify-center"
            )}>
            <button
              onClick={handleLogout}
              disabled={auth.logoutInProgress}
              aria-label={isIconOnly ? "Выйти из аккаунта" : undefined}
              className={cn(
                "group relative flex items-center rounded-2xl text-sm font-medium text-slate-600 transition-all hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/70",
                "cursor-pointer",
                "disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500",
                isIconOnly
                  ? "h-12 w-12 justify-center p-0"
                  : isMobileViewport
                  ? "gap-2 px-3 py-2"
                  : "gap-3 px-4 py-3"
              )}>
              {/* Иконка */}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200/70 text-slate-600 transition-colors group-hover:bg-rose-100 group-hover:text-rose-600 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-rose-500/20 dark:group-hover:text-rose-200">
                <LogoutIcon className="h-4 w-4" aria-hidden />
              </span>
              {/* Текст */}
              <span
                aria-hidden={isIconOnly}
                className={cn(
                  "whitespace-nowrap text-sm font-medium transition-all duration-300",
                  isIconOnly ? "hidden" : ""
                )}>
                {auth.logoutInProgress ? "Выходим..." : "Выйти"}
              </span>
            </button>
          </div>
        </aside>

        <main className="flex flex-1 flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-elevated backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70 lg:p-8">
          <header className="flex flex-col gap-4 border-b border-slate-200/60 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700/60">
            <div className="flex flex-col gap-1">
              <h1>Контрольная панель</h1>
              {auth.username ? (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Вошел: {auth.username}
                </span>
              ) : null}
            </div>
            {!isMobileViewport ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
                onClick={toggleCollapsed}
                aria-expanded={!collapsed}
                aria-pressed={!collapsed}
                aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}>
                {collapsed ? "Раскрыть меню" : "Свернуть меню"}
              </Button>
            ) : null}
          </header>

          {auth.error ? (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-300/60 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
              <span className="flex-1" role="alert">
                {auth.error}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  void auth.refresh().catch(() => undefined);
                }}>
                Повторить
              </Button>
            </div>
          ) : null}

          <section className="flex flex-1 flex-col gap-6 pb-2">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
