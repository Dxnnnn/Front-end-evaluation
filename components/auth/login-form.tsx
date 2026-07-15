"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import type { AuthUser } from "@/lib/types/auth";
import {
  clearRememberMe,
  getRememberMe,
  saveRememberMe,
} from "@/lib/auth/remember-me";
import { PasswordToggle } from "@/components/auth/password-toggle";
import { AuthLoadingScreen } from "@/components/auth/auth-loading-screen";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  useEffect(() => {
    const remembered = getRememberMe();

    if (remembered) {
      setUsername(remembered.username);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    setShowLoadingScreen(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const data = (await response.json()) as {
        user?: AuthUser;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Unable to sign in. Please try again.");
        setShowLoadingScreen(false);
        setIsSubmitting(false);
        return;
      }

      if (rememberMe) {
        saveRememberMe(username);
      } else {
        clearRememberMe();
      }

      const destination =
        data.user?.role === "admin" ? "/admin" : "/user";

      router.push(destination);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setShowLoadingScreen(false);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {showLoadingScreen ? (
        <AuthLoadingScreen label="Signing in..." />
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-slate-700"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your username"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
          <PasswordToggle
            showPassword={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          id="remember-me"
          name="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
        />
        <span className="text-sm text-slate-700">Remember me</span>
      </label>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full shrink-0 items-center justify-center rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
    </>
  );
}
