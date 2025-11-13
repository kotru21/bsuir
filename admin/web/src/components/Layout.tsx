import { NavLink } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import type { ReactElement, ReactNode } from "react";
import { useAuth } from "../auth/AuthProvider";
import logoUrl from "../assets/logo.png";
import statsUrl from "../assets/stats.svg";
import viewRespUrl from "../assets/viewResp.svg";
import logoutUrl from "../assets/logout.svg";
import layoutStyles from "./Layout.module.css";
import sidebarStyles from "./Sidebar.module.css";
import buttonStyles from "./Button.module.css";
import statusStyles from "./StatusMessage.module.css";

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
    <div className={layoutStyles.layoutContainer}>
      <aside
        className={
          sidebarStyles.sidebar +
          (collapsed ? ` ${sidebarStyles.collapsed}` : "")
        }>
        <div className={sidebarStyles.brand}>
          <img src={logoUrl} alt="Логотип" className={sidebarStyles.logo} />
          <div className={sidebarStyles.brandText}>
            <strong>Админ-панель</strong>
          </div>
        </div>
        <nav className={sidebarStyles.nav}>
          <NavLink
            end
            to="/"
            className={({ isActive }: { isActive: boolean }) =>
              isActive
                ? `${sidebarStyles.navLink} ${sidebarStyles.navLinkActive}`
                : sidebarStyles.navLink
            }>
            <span className={sidebarStyles.navLinkIcon} aria-hidden>
              <img
                src={statsUrl}
                alt=""
                className={sidebarStyles.navLinkIconImg}
              />
            </span>
            <span className={sidebarStyles.navLinkText}>Обзор</span>
          </NavLink>
          <NavLink
            to="/submissions"
            className={({ isActive }: { isActive: boolean }) =>
              isActive
                ? `${sidebarStyles.navLink} ${sidebarStyles.navLinkActive}`
                : sidebarStyles.navLink
            }>
            <span className={sidebarStyles.navLinkIcon} aria-hidden>
              <img
                src={viewRespUrl}
                alt=""
                className={sidebarStyles.navLinkIconImg}
              />
            </span>
            <span className={sidebarStyles.navLinkText}>Опросы</span>
          </NavLink>
        </nav>
        <div className={sidebarStyles.footer}>
          <button
            className={`${buttonStyles.button} ${buttonStyles.secondary} ${sidebarStyles.logout}`}
            onClick={handleLogout}
            disabled={auth.logoutInProgress}
            aria-disabled={auth.logoutInProgress}
            title={auth.logoutInProgress ? "Выходим..." : "Выйти"}
            style={{ marginTop: "1rem" }}>
            <span className={sidebarStyles.footerIcon} aria-hidden>
              <img
                src={logoutUrl}
                alt=""
                className={sidebarStyles.footerIconImg}
              />
            </span>
            <span className={sidebarStyles.footerText}>
              {auth.logoutInProgress ? "Выходим..." : "Выйти"}
            </span>
          </button>
        </div>
      </aside>
      <main className={layoutStyles.main}>
        <header className={layoutStyles.mainHeader}>
          <button
            className={layoutStyles.burger}
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Развернуть сайдбар" : "Свернуть сайдбар"}>
            ☰
          </button>

          <div className={layoutStyles.headerInfo}>
            <h1>Контрольная панель</h1>
            {auth.username ? (
              <span className={layoutStyles.user}>{auth.username}</span>
            ) : null}
          </div>
        </header>
        {auth.error ? (
          <div className={`${statusStyles.status} ${statusStyles.error}`}>
            <span className={statusStyles.text}>{auth.error}</span>
            <button
              className={`${buttonStyles.button} ${buttonStyles.secondary}`}
              onClick={() => {
                void auth.refresh().catch(() => undefined);
              }}>
              Повторить попытку
            </button>
          </div>
        ) : null}
        <section className={layoutStyles.mainContent}>{children}</section>
      </main>
    </div>
  );
}
