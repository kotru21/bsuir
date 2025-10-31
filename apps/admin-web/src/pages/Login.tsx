import React, { ChangeEvent, FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import type { LoginRequest, LoginResponse } from "@bsuir-admin/types";
import { login } from "../api/client.js";
import { useAuth } from "../auth/AuthProvider.js";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const location = useLocation();

  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (session) => {
      signIn(session);
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <h1 className="mb-2 text-xl font-semibold">Admin Sign in</h1>
        {location.state?.from && (
          <p className="mb-4 text-xs text-slate-400">
            Please authenticate to access {location.state.from.pathname}
          </p>
        )}
        <label
          className="mb-2 block text-xs uppercase tracking-wide text-slate-400"
          htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          value={username}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setUsername(event.target.value)
          }
          className="mb-4 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
          autoComplete="username"
        />
        <label
          className="mb-2 block text-xs uppercase tracking-wide text-slate-400"
          htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
          className="mb-4 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
          autoComplete="current-password"
        />
        {mutation.isError && (
          <p className="mb-4 text-sm text-rose-400">
            Authentication failed. Check your credentials.
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-700"
          disabled={mutation.isPending}>
          {mutation.isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
