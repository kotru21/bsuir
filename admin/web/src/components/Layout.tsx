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
  // Track viewport width to scope scroll-driven behavior to mobile only.
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.innerWidth < 1024;
  });
  const [isNavCompact, setIsNavCompact] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem("sidebarCollapsed", collapsed ? "1" : "0");
    } catch (_e) {
      /* ignore */
    }
  }, [collapsed]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // On mobile, collapse the sidebar automatically once the user scrolls.
  useEffect(() => {
    if (typeof window === "undefined" || !isMobileViewport) {
      setIsNavCompact(false);
      return;
    }
    const handleScroll = () => {
      setIsNavCompact(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileViewport]);

  const effectiveCollapsed = isMobileViewport ? isNavCompact : collapsed;
  const hideSidebarLabels = isMobileViewport && isNavCompact;

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
            "lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto",
            effectiveCollapsed ? "lg:w-24 lg:px-4" : "lg:w-72",
            isMobileViewport && isNavCompact
              ? "sticky top-0 z-30 gap-6 rounded-2xl border-slate-200/80 bg-white/95 px-4 py-3 shadow-lg dark:border-slate-800/70 dark:bg-slate-950/90"
              : ""
          )}>
          {/* Заголовок с логотипом */}
          <div className="flex items-center gap-4 shrink-0">
            <img
              src={logoUrl}
              alt="Логотип"
              className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200/60 bg-white/80 p-2 shadow-sm dark:border-slate-700/60 dark:bg-slate-950"
            />
            <div
              className={cn(
                "min-w-0 flex-1 overflow-hidden transition-all duration-300",
                collapsed ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100",
                hideSidebarLabels ? "hidden" : ""
              )}
              aria-hidden={hideSidebarLabels}>
              <span className="block whitespace-nowrap text-sm font-medium uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                BSUIR Sports
              </span>
              <strong className="block whitespace-nowrap text-lg text-slate-900 dark:text-slate-100">
                Админ-панель
              </strong>
            </div>
          </div>

          {/* Навигация */}
          <nav
            className={cn(
              "flex flex-col gap-2 shrink-0",
              hideSidebarLabels ? "flex-row items-center gap-3" : ""
            )}>
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                end={to === "/"}
                to={to}
                aria-label={effectiveCollapsed ? label : undefined}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center rounded-2xl text-sm font-medium transition-all hover:bg-slate-100/80 hover:text-slate-900 dark:hover:bg-slate-800/70 dark:hover:text-white",
                    "cursor-pointer",
                    isActive
                      ? "bg-sky-500/15 text-sky-600 ring-1 ring-inset ring-sky-500/30 dark:bg-sky-500/20 dark:text-sky-200"
                      : "text-slate-600 dark:text-slate-300",
                    effectiveCollapsed
                      ? "gap-3 px-3 py-3 lg:justify-center lg:px-3 lg:py-3"
                      : "gap-3 px-4 py-3",
                    hideSidebarLabels ? "flex-1 justify-center" : ""
                  )
                }>
                {/* Иконка */}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shadow-sm transition-colors group-hover:bg-sky-100 group-hover:text-sky-600 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-sky-500/20 dark:group-hover:text-sky-200">
                  {(() => {
                    const Icon = icon as unknown as ComponentType<
                      SVGProps<SVGSVGElement>
                    >;
                    return <Icon className="h-4 w-4" aria-hidden />;
                  })()}
                </span>
                {/* Текст */}
                <span
                  aria-hidden={hideSidebarLabels}
                  className={cn(
                    "whitespace-nowrap text-sm font-medium transition-all duration-300",
                    effectiveCollapsed
                      ? "lg:absolute lg:left-0 lg:w-0 lg:opacity-0 lg:overflow-hidden"
                      : "",
                    hideSidebarLabels ? "hidden" : ""
                  )}>
                  {label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Кнопка выхода */}
          <div className="mt-auto shrink-0">
            <button
              onClick={handleLogout}
              disabled={auth.logoutInProgress}
              aria-label={effectiveCollapsed ? "Выйти из аккаунта" : undefined}
              className={cn(
                "group relative flex w-full items-center rounded-2xl text-sm font-medium text-slate-600 transition-all hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/70",
                "cursor-pointer",
                "disabled:cursor-not-allowed disabled:opacity-50",
                effectiveCollapsed
                  ? "gap-3 px-3 py-3 lg:justify-center lg:px-3 lg:py-3"
                  : "gap-3 px-4 py-3",
                hideSidebarLabels ? "justify-center" : ""
              )}>
              {/* Иконка */}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200/70 text-slate-600 transition-colors group-hover:bg-rose-100 group-hover:text-rose-600 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-rose-500/20 dark:group-hover:text-rose-200">
                <LogoutIcon className="h-4 w-4" aria-hidden />
              </span>
              {/* Текст */}
              <span
                aria-hidden={hideSidebarLabels}
                className={cn(
                  "whitespace-nowrap text-sm font-medium transition-all duration-300",
                  effectiveCollapsed
                    ? "lg:absolute lg:left-0 lg:w-0 lg:opacity-0 lg:overflow-hidden"
                    : "",
                  hideSidebarLabels ? "hidden" : ""
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
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hidden text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white lg:inline-flex"
              )}
              onClick={toggleCollapsed}
              aria-expanded={!collapsed}
              aria-pressed={!collapsed}
              aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}>
              {collapsed ? "Раскрыть меню" : "Свернуть меню"}
            </Button>
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
