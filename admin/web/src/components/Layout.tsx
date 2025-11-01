import { NavLink } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import type { ReactElement, ReactNode } from "react";
import { useAuth } from "../auth/AuthProvider";
import logoUrl from "../assets/logo.png";

export function Layout({ children }: { children: ReactNode }): ReactElement {
  const auth = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebarCollapsed") === "1";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sidebarCollapsed", collapsed ? "1" : "0");
    } catch (e) {
      /* ignore */
    }
  }, [collapsed]);

  const handleLogout = useCallback(() => {
    void auth.logout();
  }, [auth]);

  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);

  return (
    <div className="layout-container">
      <aside className={"sidebar" + (collapsed ? " sidebar--collapsed" : "")}>
        <div className="sidebar__brand">
          <img src={logoUrl} alt="Логотип" className="sidebar__logo" />
          <div className="sidebar__brand-text">
            <strong>Админ-панель</strong>
          </div>
        </div>
        <nav className="sidebar__nav">
          <NavLink
            end
            to="/"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? "nav-link nav-link--active" : "nav-link"
            }>
            <span className="nav-link__text">Обзор</span>
          </NavLink>
          <NavLink
            to="/submissions"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? "nav-link nav-link--active" : "nav-link"
            }>
            <span className="nav-link__text">Опросы</span>
          </NavLink>
        </nav>
      </aside>
      <main className="main">
        <header className="main__header">
          <button
            className="burger"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Развернуть сайдбар" : "Свернуть сайдбар"}>
            ☰
          </button>

          <div className="main__header-info">
            <h1>Контрольная панель</h1>
            {auth.username ? (
              <span className="main__user">{auth.username}</span>
            ) : null}
          </div>
          <button
            className="button button--secondary"
            onClick={handleLogout}
            disabled={auth.logoutInProgress}
            aria-disabled={auth.logoutInProgress}>
            {auth.logoutInProgress ? "Выходим..." : "Выйти"}
          </button>
        </header>
        {auth.error ? (
          <div className="status-message status-message--error">
            <span className="status-message__text">{auth.error}</span>
            <button
              className="button button--secondary"
              onClick={() => {
                void auth.refresh().catch(() => undefined);
              }}>
              Повторить попытку
            </button>
          </div>
        ) : null}
        <section className="main__content">{children}</section>
      </main>
    </div>
  );
}
