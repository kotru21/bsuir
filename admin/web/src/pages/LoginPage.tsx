import { FormEvent, ChangeEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { FullscreenSpinner } from "../components/FullscreenSpinner";
import { Button } from "../components/Button";
import logoUrl from "../assets/logo.png";
import { cn } from "../lib/cn";

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

  const globalError = auth.error;
  return (
    <div className="relative min-h-screen bg-transparent">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute right-0 top-48 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-16">
        <div className="grid w-full gap-12 rounded-3xl border border-slate-200/60 bg-white/90 p-8 shadow-elevated backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/70 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:p-12">
          <section className="hidden flex-col justify-center gap-6 lg:flex">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 dark:bg-sky-500/20 dark:text-sky-200">
                <img src={logoUrl} alt="Логотип" className="h-12 w-12" />
              </span>
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  BSUIR Sports
                </span>
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
                  Админ-панель
                </h2>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-3 rounded-2xl bg-slate-100/70 px-4 py-3 dark:bg-slate-900/60">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
                  1
                </span>
                Безопасный вход и контроль доступа сотрудников
              </li>
              <li className="flex items-center gap-3 rounded-2xl bg-slate-100/70 px-4 py-3 dark:bg-slate-900/60">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
                  2
                </span>
                Аналитика по опросам студентов в режиме реального времени
              </li>
              <li className="flex items-center gap-3 rounded-2xl bg-slate-100/70 px-4 py-3 dark:bg-slate-900/60">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20">
                  3
                </span>
                AI-пояснения для рекомендаций по спортивным секциям
              </li>
            </ul>
          </section>

          <form
            className="flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white/95 p-8 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.45)] dark:border-slate-800/60 dark:bg-slate-950/70"
            onSubmit={handleSubmit}
            aria-labelledby="loginTitle">
            <div className="flex flex-col items-center gap-3 lg:hidden">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 dark:bg-sky-500/20 dark:text-sky-200">
                <img src={logoUrl} alt="Логотип" className="h-12 w-12" />
              </span>
              <h1 id="loginTitle" className="text-center text-2xl">
                Вход администратора
              </h1>
            </div>

            <div className="hidden lg:flex lg:flex-col lg:gap-2">
              <h1 id="loginTitle">Вход администратора</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Используйте служебный аккаунт для доступа к панели управления
              </p>
            </div>

            {globalError ? (
              <p
                className="rounded-xl border border-rose-300/60 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"
                role="alert">
                {globalError}
              </p>
            ) : null}

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Логин
              </span>
              <input
                name="username"
                autoComplete="username"
                type="text"
                className={cn(
                  "h-12 rounded-xl border border-slate-200/80 bg-white/90 px-4 text-base font-medium text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/15 dark:border-slate-800/70 dark:bg-slate-900/80 dark:text-slate-100",
                  globalError
                    ? "border-rose-400/80 focus:border-rose-500 focus:ring-rose-500/20"
                    : ""
                )}
                value={username}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setUsername(event.target.value)
                }
                required
                autoFocus
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Пароль
              </span>
              <input
                name="current-password"
                autoComplete="current-password"
                type="password"
                className={cn(
                  "h-12 rounded-xl border border-slate-200/80 bg-white/90 px-4 text-base font-medium text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/15 dark:border-slate-800/70 dark:bg-slate-900/80 dark:text-slate-100",
                  globalError
                    ? "border-rose-400/80 focus:border-rose-500 focus:ring-rose-500/20"
                    : ""
                )}
                value={password}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setPassword(event.target.value)
                }
                required
              />
            </label>

            {error ? (
              <p
                className="rounded-xl border border-rose-300/60 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"
                role="alert">
                {error}
              </p>
            ) : null}

            <Button
              className="w-full"
              type="submit"
              disabled={submitting}
              aria-label={submitting ? "Входим" : "Войти"}>
              {submitting ? "Входим..." : "Войти"}
            </Button>

            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              Доступ только для сотрудников БГУИР. Обратитесь к администратору,
              если забыли пароль.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
