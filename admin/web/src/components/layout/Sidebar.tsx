import type { ReactElement } from "react";
import logoUrl from "../../assets/logo.png";
import { SidebarNavItem } from "./SidebarNavItem.js";
import { cn } from "../../lib/cn";
import LogoutButton from "./LogoutButton.js";

export type NavItem = { to: string; label: string; icon: any };

export type SidebarProps = {
  collapsed: boolean;
  isMobileViewport: boolean;
  showMobileLabels: boolean;
  isIconOnly: boolean;
  hideLogoutText: boolean;
  navItems: NavItem[];
  onLogout: () => void;
  logoutInProgress?: boolean;
};

export function Sidebar({
  collapsed,
  isMobileViewport,
  showMobileLabels,
  isIconOnly,
  hideLogoutText,
  navItems,
  onLogout,
  logoutInProgress,
}: SidebarProps): ReactElement {
  return (
    <aside
      aria-label="Боковое меню"
      className={cn(
        "rounded-3xl border border-slate-200/70 bg-white/90 shadow-elevated backdrop-blur transition-all duration-300 dark:border-slate-700/60 dark:bg-slate-900/70",
        "transition-all duration-300 ease-in-out",
        isMobileViewport
          ? "sticky top-4 z-30 mt-2 flex flex-row w-full items-center gap-3 px-3 py-2"
          : cn(
              "flex min-h-0 flex-col gap-8 p-6 overflow-hidden",
              "lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto",
              collapsed ? "lg:w-24 lg:px-4" : "lg:w-72"
            )
      )}>
      {!isMobileViewport ? (
        <div className="flex items-center gap-4 shrink-0">
          <img
            src={logoUrl}
            alt="Логотип"
            className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200/60 bg-white/80 p-2 shadow-sm dark:border-slate-700/60 dark:bg-slate-950"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1 overflow-hidden">
              <div
                className="transition-all duration-300 ease-in-out"
                style={{
                  opacity: collapsed ? 0 : 1,
                  transform: collapsed ? "translateX(-10px)" : "translateX(0)",
                  transitionDelay: collapsed ? "0ms" : "100ms",
                }}>
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
      ) : null}

      <nav
        role="navigation"
        aria-label="Основная навигация админ-панели"
        className={cn(
          "shrink-0",
          isMobileViewport
            ? "flex items-center gap-2 overflow-x-auto"
            : "flex flex-col gap-2 w-full"
        )}>
        {navItems.map(({ to, label, icon }) => (
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

      <div
        className={cn(
          "shrink-0",
          isMobileViewport ? "ml-auto w-auto" : "mt-auto w-full"
        )}>
        <LogoutButton
          onLogout={onLogout}
          logoutInProgress={logoutInProgress}
          isIconOnly={isIconOnly}
          isMobileViewport={isMobileViewport}
          hideLogoutText={hideLogoutText}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
