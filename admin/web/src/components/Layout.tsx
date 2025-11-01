import { NavLink } from "react-router-dom";
import { useCallback } from "react";
import type { ReactElement, ReactNode } from "react";
import { useAuth } from "../auth/AuthProvider";
import logoUrl from "../assets/logo.png";

export function Layout({ children }: { children: ReactNode }): ReactElement {
  const auth = useAuth();
  const handleLogout = useCallback(() => {
    void auth.logout();
  }, [auth]);

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <img src={logoUrl} alt="Логотип" className="sidebar__logo" />
          <div>
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
            Обзор
          </NavLink>
          <NavLink
            to="/submissions"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? "nav-link nav-link--active" : "nav-link"
            }>
            Опросы
          </NavLink>
        </nav>
      </aside>
      <main className="main">
        <header className="main__header">
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
