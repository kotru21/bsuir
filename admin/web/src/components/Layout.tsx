import { useCallback } from "react";
import type { ReactElement, ReactNode } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "./Button";
import useResponsiveLayout from "../hooks/useResponsiveLayout.js";
import useSidebarCollapsed from "../hooks/useSidebarCollapsed.js";
import { NAV_ITEMS } from "../config/navigation.js";
import Sidebar from "./layout/Sidebar.js";
import Topbar from "./layout/Topbar.js";

export function Layout({ children }: { children: ReactNode }): ReactElement {
  const auth = useAuth();
  const { collapsed, toggle } = useSidebarCollapsed();
  const { isMobileViewport, showMobileLabels, hideLogoutText } =
    useResponsiveLayout();
  const isIconOnly = isMobileViewport ? !showMobileLabels : collapsed;

  const handleLogout = useCallback(() => {
    void auth.logout();
  }, [auth]);

  const toggleCollapsed = toggle;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:items-start">
        <Sidebar
          navItems={NAV_ITEMS}
          collapsed={collapsed}
          isMobileViewport={isMobileViewport}
          isIconOnly={isIconOnly}
          hideLogoutText={hideLogoutText}
          onLogout={handleLogout}
          logoutInProgress={auth.logoutInProgress}
        />

        <main className="flex flex-1 flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-elevated backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70 lg:p-8">
          <Topbar
            username={auth.username}
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
            isMobileViewport={isMobileViewport}
          />

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
