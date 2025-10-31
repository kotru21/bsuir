import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

interface AuthSession {
  accessToken: string | null;
  expiresAt: string | null;
}

interface AuthContextValue extends AuthSession {
  signIn: (session: { accessToken: string; expiresAt: string }) => void;
  signOut: () => void;
}

const TOKEN_STORAGE_KEY = "bsuir-admin-session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readInitialState(): AuthSession {
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) {
      return { accessToken: null, expiresAt: null };
    }
    const parsed = JSON.parse(stored) as AuthSession;
    return {
      accessToken: parsed.accessToken ?? null,
      expiresAt: parsed.expiresAt ?? null,
    };
  } catch {
    return { accessToken: null, expiresAt: null };
  }
}

export const AuthProvider: React.FC = () => {
  const [session, setSession] = useState<AuthSession>(() => readInitialState());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session.accessToken) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      return;
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const signIn = useCallback(
    (nextSession: { accessToken: string; expiresAt: string }) => {
      setSession(nextSession);
      navigate("/", { replace: true });
    },
    [navigate]
  );

  const signOut = useCallback(() => {
    setSession({ accessToken: null, expiresAt: null });
    if (location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: session.accessToken,
      expiresAt: session.expiresAt,
      signIn,
      signOut,
    }),
    [session.accessToken, session.expiresAt, signIn, signOut]
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
