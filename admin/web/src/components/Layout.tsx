import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthProvider";

export function Layout({ children }: { children: ReactNode }): JSX.Element {
  const auth = useAuth();

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__logo">🏋️</span>
          <div>
            <strong>BSUIR Sport</strong>
            <small>Админ-панель</small>
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
            onClick={() => auth.logout()}>
            Выйти
          </button>
        </header>
        <section className="main__content">{children}</section>
      </main>
    </div>
  );
}
