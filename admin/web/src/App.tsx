import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { DashboardPage } from "./pages/DashboardPage";
import { SubmissionsPage } from "./pages/SubmissionsPage";
import { LoginPage } from "./pages/LoginPage";
import { Layout } from "./components/Layout";
import { FullscreenSpinner } from "./components/FullscreenSpinner";

function ProtectedRoute({
  children,
}: {
  children: React.JSX.Element;
}): React.JSX.Element {
  const auth = useAuth();

  if (auth.loading) {
    return <FullscreenSpinner message="Загружаем данные..." />;
  }

  if (!auth.authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AuthenticatedLayout(): React.JSX.Element {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
}

export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AuthenticatedLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="submissions" element={<SubmissionsPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
