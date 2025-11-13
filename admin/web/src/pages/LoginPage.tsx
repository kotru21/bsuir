import { FormEvent, ChangeEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { FullscreenSpinner } from "../components/FullscreenSpinner";
import logoUrl from "../assets/logo.png";
import loginStyles from "../components/Login.module.css";
import buttonStyles from "../components/Button.module.css";

export function LoginPage(): React.JSX.Element {
  const auth = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
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

  const globalError = auth.error;

  return (
    <div className={loginStyles.screen}>
      <form
        className={loginStyles.form}
        onSubmit={handleSubmit}
        aria-labelledby="loginTitle">
        <div className={loginStyles.logoWrap}>
          <img src={logoUrl} alt="Логотип" className={loginStyles.logo} />
        </div>
        <h1 id="loginTitle">Вход администратора</h1>
        <div className={loginStyles.meta}>
          Введите учетные данные для доступа к панели
        </div>
        {globalError ? (
          <p className={loginStyles.error} role="alert">
            {globalError}
          </p>
        ) : null}

        <div>
          <div className={loginStyles.fieldLabel}>Логин</div>
          <input
            name="username"
            autoComplete="username"
            type="text"
            className={loginStyles.input}
            value={username}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setUsername(event.target.value)
            }
            required
            autoFocus
          />
        </div>

        <div>
          <div className={loginStyles.fieldLabel}>Пароль</div>
          <input
            name="current-password"
            autoComplete="current-password"
            type="password"
            className={loginStyles.input}
            value={password}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        {error ? (
          <p className={loginStyles.error} role="alert">
            {error}
          </p>
        ) : null}

        <div className={loginStyles.actions}>
          <label className={loginStyles.remember}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRemember(e.target.checked)
              }
            />
            Запомнить меня
          </label>
          <a
            className={loginStyles.forgot}
            href="#"
            onClick={(e) => e.preventDefault()}>
            Забыли пароль?
          </a>
        </div>

        <div className={loginStyles.submitRow}>
          <button
            className={`${buttonStyles.button}`}
            type="submit"
            disabled={submitting}
            aria-label={submitting ? "Входим" : "Войти"}>
            {submitting ? "Входим..." : "Войти"}
          </button>
        </div>
      </form>
    </div>
  );
}
