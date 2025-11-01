import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.js";

const AdminLayout: React.FC = () => {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex flex-col text-sm">
          <span className="font-semibold tracking-wide">
            BSUIR Admin Dashboard
          </span>
          {user && (
            <span className="text-xs text-slate-400">
              Signed in as {user.username} ({user.role})
            </span>
          )}
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-emerald-400" : "text-slate-300"
            }
            to="/">
            Overview
          </NavLink>
          <button
            onClick={() => {
              void signOut();
            }}
            className="rounded border border-slate-700 px-3 py-1 text-xs uppercase tracking-wide hover:bg-slate-800"
            type="button">
            Sign out
          </button>
        </nav>
      </header>
      <main className="px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
