"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import {
  accountToAuthUser,
  findAccountByCredentials,
} from "@/lib/accounts/storage";
import type { AuthUser, LoginPortal } from "@/lib/types/auth";
import { getRoleDestination, isRoleAllowedInPortal } from "@/lib/types/auth";
import { PasswordToggle } from "@/components/auth/password-toggle";
import { AuthLoadingScreen } from "@/components/auth/auth-loading-screen";

export function LoginForm({ portal }: { portal: LoginPortal }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    setShowLoadingScreen(true);

    try {
      const localAccount = findAccountByCredentials(username, password);

      if (localAccount) {
        const user = accountToAuthUser(localAccount);

        if (!isRoleAllowedInPortal(user.role, portal)) {
          const portalLabel = portal === "staff" ? "coordinator" : "student";
          setError(`This account is not authorized for ${portalLabel} login.`);
          setShowLoadingScreen(false);
          setIsSubmitting(false);
          return;
        }

        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user }),
        });

        const data = (await response.json()) as {
          user?: AuthUser;
          error?: string;
        };

        if (!response.ok || !data.user) {
          setError(data.error ?? "Unable to sign in. Please try again.");
          setShowLoadingScreen(false);
          setIsSubmitting(false);
          return;
        }

        router.push(getRoleDestination(data.user.role));
        router.refresh();
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expectedPortal: portal,
        }),
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

      if (!data.user) {
        setError("Unable to sign in. Please try again.");
        setShowLoadingScreen(false);
        setIsSubmitting(false);
        return;
      }

      router.push(getRoleDestination(data.user.role));
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setShowLoadingScreen(false);
      setIsSubmitting(false);
    }
  }

  const isStaffPortal = portal === "staff";

  const submitButtonClass = isStaffPortal
    ? "bg-brand-700 hover:bg-brand-800 focus:ring-brand-100"
    : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-100";

  const focusFieldClass = isStaffPortal
    ? "focus:border-brand-500 focus:ring-brand-100"
    : "focus:border-emerald-500 focus:ring-emerald-100";

  const idPlaceholder = isStaffPortal
    ? "Enter your coordinator or admin ID#"
    : "Enter your student ID#";

  return (
    <>
      {showLoadingScreen ? (
        <AuthLoadingScreen label="Signing in..." />
      ) : null}

      <form className="space-y-5 transition-colors duration-300" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label
          htmlFor="login-id"
          className="block text-sm font-medium text-slate-700"
        >
          ID#
        </label>
        <input
          id="login-id"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder={idPlaceholder}
          className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:ring-4 ${focusFieldClass}`}
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
            className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition-all duration-300 focus:ring-4 ${focusFieldClass}`}
          />
          <PasswordToggle
            showPassword={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
          />
        </div>
      </div>

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
        className={`flex w-full shrink-0 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70 ${submitButtonClass}`}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
    </>
  );
}
