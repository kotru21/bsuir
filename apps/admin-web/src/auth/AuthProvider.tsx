import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { LoginResponse } from "@bsuir-admin/types";
import {
  logout as logoutRequest,
  refreshSession as refreshSessionRequest,
  UnauthorizedError,
} from "../api/client.js";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthSession {
  accessToken: string;
  expiresAt: string;
  user: LoginResponse["user"];
}

interface AuthContextValue {
  accessToken: string | null;
  expiresAt: string | null;
  user: AuthSession["user"] | null;
  status: AuthStatus;
  signIn: (session: LoginResponse) => void;
  signOut: () => Promise<void>;
  refresh: () => Promise<LoginResponse | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const REFRESH_THRESHOLD_MS = 60_000; // refresh 1 minute before expiry

export const AuthProvider: React.FC = () => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const refreshTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimeoutRef.current) {
      window.clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  }, []);

  const applySession = useCallback(
    (next: LoginResponse | null) => {
      if (!next) {
        clearRefreshTimer();
        setSession(null);
        setStatus("unauthenticated");
        return;
      }

      const nextSession: AuthSession = {
        accessToken: next.accessToken,
        expiresAt: next.expiresAt,
        user: next.user,
      };

      setSession(nextSession);
      setStatus("authenticated");
    },
    [clearRefreshTimer]
  );

  const refresh = useCallback(async (): Promise<LoginResponse | null> => {
    try {
      const next = await refreshSessionRequest();
      applySession(next);
      return next;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        applySession(null);
        return null;
      }
      throw error;
    }
  }, [applySession]);

  useEffect(() => {
    if (!session) {
      clearRefreshTimer();
      return;
    }

    clearRefreshTimer();
    const expiresIn = new Date(session.expiresAt).getTime() - Date.now();

    const delay = Number.isNaN(expiresIn)
      ? REFRESH_THRESHOLD_MS
      : Math.max(expiresIn - REFRESH_THRESHOLD_MS, 5_000);

    refreshTimeoutRef.current = window.setTimeout(() => {
      refresh().catch(() => {
        // refresh already handles UnauthorizedError by clearing the session
      });
    }, delay);

    return clearRefreshTimer;
  }, [clearRefreshTimer, refresh, session]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const next = await refreshSessionRequest();
        if (!cancelled) {
          applySession(next);
        }
      } catch (error) {
        if (!cancelled) {
          applySession(null);
        }
      } finally {
        if (!cancelled) {
          setStatus((current) =>
            current === "loading" ? "unauthenticated" : current
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      clearRefreshTimer();
    };
  }, [applySession, clearRefreshTimer]);

  const signIn = useCallback(
    (nextSession: LoginResponse) => {
      applySession(nextSession);
      navigate("/", { replace: true });
    },
    [applySession, navigate]
  );

  const signOut = useCallback(async () => {
    clearRefreshTimer();
    try {
      await logoutRequest();
    } catch {
      // ignore logout failures to avoid locking the user in a broken session
    }
    applySession(null);
    if (location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [applySession, clearRefreshTimer, location.pathname, navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: session?.accessToken ?? null,
      expiresAt: session?.expiresAt ?? null,
      user: session?.user ?? null,
      status,
      signIn,
      signOut,
      refresh,
    }),
    [
      refresh,
      session?.accessToken,
      session?.expiresAt,
      session?.user,
      signIn,
      signOut,
      status,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
