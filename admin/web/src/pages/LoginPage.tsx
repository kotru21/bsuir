import { FormEvent, ChangeEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { FullscreenSpinner } from "../components/FullscreenSpinner";
import logoUrl from "../assets/logo.png";

export function LoginPage(): React.JSX.Element {
  const auth = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (auth.loading) {
    return <FullscreenSpinner message="Проверяем авторизацию..." />;
  }

  if (auth.authenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await auth.login(username, password);
    } catch (err) {
      console.error("Login failed", err);
      setError("Неверный логин или пароль");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-screen">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-logo-wrap">
          <img src={logoUrl} alt="Логотип" className="login-logo" />
        </div>
        <h1>Вход администратора</h1>
        <label>
          Логин
          <input
            type="text"
            value={username}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setUsername(event.target.value)
            }
            required
            autoFocus
          />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Входим..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
