import type { ReactElement, ElementType } from "react";
// SidebarNavItem is used by SidebarNav
import SidebarLogo from "./SidebarLogo.js";
import SidebarNav from "./SidebarNav.js";
import { cn } from "../../lib/cn";
import LogoutButton from "./LogoutButton.js";

export type NavItem = {
  to: string;
  label: string;
  icon: ElementType;
};

export type SidebarProps = {
  collapsed: boolean;
  isMobileViewport: boolean;

  isIconOnly: boolean;

  navItems: NavItem[];
  onLogout: () => void;
  logoutInProgress?: boolean;
};

export function Sidebar({
  collapsed,
  isMobileViewport,
  isIconOnly,

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
      {!isMobileViewport ? <SidebarLogo collapsed={collapsed} /> : null}

      <SidebarNav
        navItems={navItems}
        isIconOnly={isIconOnly}
        isMobileViewport={isMobileViewport}
      />

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
        />
      </div>
    </aside>
  );
}

export default Sidebar;
