import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactElement, ReactNode } from "react";
import {
  fetchCsrfToken,
  fetchSession,
  loginRequest,
  logoutRequest,
} from "../api/auth";

interface AuthState {
  loading: boolean;
  authenticated: boolean;
  username: string | null;
  csrfToken: string | null;
  error: string | null;
  logoutInProgress: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const INITIAL_STATE: AuthState = {
  loading: true,
  authenticated: false,
  username: null,
  csrfToken: null,
  error: null,
  logoutInProgress: false,
};

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);

  const refreshCsrf = useCallback(async () => {
    try {
      const token = await fetchCsrfToken();
      setState((prev: AuthState) => ({
        ...prev,
        csrfToken: token,
        error: null,
      }));
      return token;
    } catch (err) {
      console.error("Failed to fetch CSRF token", err);
      setState((prev: AuthState) => ({
        ...prev,
        error: "Не удалось получить CSRF токен",
      }));
      throw err;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const session = await fetchSession();
      setState((prev: AuthState) => ({
        ...prev,
        authenticated: session.authenticated,
        username: session.username,
        error: null,
      }));
    } catch (err) {
      console.error("Failed to fetch session", err);
      setState((prev: AuthState) => ({
        ...prev,
        authenticated: false,
        username: null,
        error: "Не удалось получить данные сессии",
      }));
    }
  }, []);

  const initialize = useCallback(async () => {
    try {
      const token = await refreshCsrf();
      if (token) {
        await refreshSession();
      }
    } finally {
      setState((prev: AuthState) => ({ ...prev, loading: false }));
    }
  }, [refreshCsrf, refreshSession]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const login = useCallback(
    async (username: string, password: string) => {
      const token = state.csrfToken ?? (await refreshCsrf());
      await loginRequest({ username, password, csrfToken: token });
      await Promise.all([refreshSession(), refreshCsrf()]);
    },
    [refreshSession, refreshCsrf, state.csrfToken]
  );

  const logout = useCallback(async () => {
    setState((prev: AuthState) => ({
      ...prev,
      logoutInProgress: true,
      error: null,
    }));
    try {
      const token = state.csrfToken ?? (await refreshCsrf());
      await logoutRequest(token);
      setState((prev: AuthState) => ({
        ...prev,
        authenticated: false,
        username: null,
      }));
      await refreshCsrf();
    } catch (err) {
      console.error("Logout failed", err);
      if (err) {
        console.error("Logout failed", err);
      }
      setState((prev: AuthState) => ({
        ...prev,
        error: "Не удалось завершить сессию. Попробуйте еще раз.",
      }));
    } finally {
      setState((prev: AuthState) => ({
        ...prev,
        logoutInProgress: false,
      }));
    }
  }, [refreshCsrf, state.csrfToken]);

  const refresh = useCallback(async () => {
    await Promise.all([refreshSession(), refreshCsrf()]);
  }, [refreshSession, refreshCsrf]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      refresh,
    }),
    [state, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
