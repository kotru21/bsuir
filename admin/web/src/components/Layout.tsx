import { NavLink } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import type { ReactElement, ReactNode, ComponentType, SVGProps } from "react";
import { useAuth } from "../auth/AuthProvider";
import logoUrl from "../assets/logo.png";
import { StatsIcon } from "./icons/StatsIcon";
import { ViewRespIcon } from "./icons/ViewRespIcon";
import { LogoutIcon } from "./icons/LogoutIcon";
import { cn } from "../lib/cn";
import { Button } from "./Button";

const NAV_ITEMS = [
  { to: "/", label: "Обзор", icon: StatsIcon },
  { to: "/submissions", label: "Опросы", icon: ViewRespIcon },
];

export function Layout({ children }: { children: ReactNode }): ReactElement {
  const auth = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebarCollapsed") === "1";
    } catch (_e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sidebarCollapsed", collapsed ? "1" : "0");
    } catch (_e) {
      /* ignore */
    }
  }, [collapsed]);

  const handleLogout = useCallback(() => {
    void auth.logout();
  }, [auth]);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:items-start">
        <aside
          className={cn(
            "flex min-h-0 flex-col gap-8 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-elevated backdrop-blur transition-all duration-300 dark:border-slate-700/60 dark:bg-slate-900/70",
            collapsed ? "lg:w-24 lg:px-4" : "lg:w-72"
          )}>
          {/* Заголовок с логотипом */}
          <div className="flex items-center gap-4">
            <img
              src={logoUrl}
              alt="Логотип"
              className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200/60 bg-white/80 p-2 shadow-sm dark:border-slate-700/60 dark:bg-slate-950"
            />
            <div
              className={cn(
                "min-w-0 flex-1 overflow-hidden transition-all duration-300",
                collapsed ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"
              )}>
              <span className="block whitespace-nowrap text-sm font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                BSUIR Sports
              </span>
              <strong className="block whitespace-nowrap text-lg text-slate-900 dark:text-slate-100">
                Админ-панель
              </strong>
            </div>
          </div>

          {/* Навигация */}
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                end={to === "/"}
                to={to}
                aria-label={collapsed ? label : undefined}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white",
                    isActive &&
                      "bg-sky-500/15 text-sky-600 ring-1 ring-inset ring-sky-500/30 dark:bg-sky-500/20 dark:text-sky-200",
                    collapsed && "lg:justify-center"
                  )
                }>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shadow-sm transition-colors group-hover:bg-sky-100 group-hover:text-sky-600 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-sky-500/20 dark:group-hover:text-sky-200">
                  {(() => {
                    const Icon = icon as unknown as ComponentType<
                      SVGProps<SVGSVGElement>
                    >;
                    return <Icon className="h-5 w-5" aria-hidden />;
                  })()}
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 overflow-hidden whitespace-nowrap text-sm font-medium text-slate-700 transition-all duration-300 dark:text-slate-100",
                    collapsed
                      ? "lg:w-0 lg:opacity-0"
                      : "lg:w-auto lg:opacity-100"
                  )}>
                  {label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Кнопка выхода */}
          <div className="mt-auto">
            <Button
              variant="secondary"
              className={cn(
                "w-full gap-3 text-sm font-medium text-slate-600 dark:text-slate-200",
                collapsed ? "lg:justify-center" : "lg:justify-start"
              )}
              onClick={handleLogout}
              disabled={auth.logoutInProgress}
              aria-label={collapsed ? "Выйти из аккаунта" : undefined}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                <LogoutIcon className="h-5 w-5" aria-hidden />
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 overflow-hidden whitespace-nowrap text-left transition-all duration-300",
                  collapsed ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"
                )}>
                {auth.logoutInProgress ? "Выходим..." : "Выйти"}
              </span>
            </Button>
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
            <Button
              variant="ghost"
              size="sm"
              className="hidden! text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white lg:inline-flex!"
              onClick={toggleCollapsed}
              aria-expanded={!collapsed}
              aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}>
              {collapsed ? "Раскрыть меню" : "Свернуть меню"}
            </Button>
          </header>

          {auth.error ? (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-300/60 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
              <span className="flex-1">{auth.error}</span>
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
