"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  clearRememberMe,
  getRememberMe,
  saveRememberMe,
} from "@/lib/auth/remember-me";
import { PasswordToggle } from "@/components/auth/password-toggle";
import { AuthLoadingScreen } from "@/components/auth/auth-loading-screen";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  useEffect(() => {
    const remembered = getRememberMe();

    if (remembered) {
      setEmail(remembered.username);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);
    setShowLoadingScreen(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        setShowLoadingScreen(false);
        setIsSubmitting(false);
        return;
      }

      if (rememberMe) {
        saveRememberMe(email);
      } else {
        clearRememberMe();
      }

      // Save logged-in admin
      localStorage.setItem("admin", JSON.stringify(data.admin));

      setShowLoadingScreen(false);
      setIsSubmitting(false);

      // Redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError("Unable to connect to the server.");
      setShowLoadingScreen(false);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {showLoadingScreen && (
        <AuthLoadingScreen label="Signing in..." />
      )}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
              onChange={(e) => setPassword(e.target.value)}
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
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
          />

          <span className="text-sm text-slate-700">
            Remember me
          </span>
        </label>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

      </form>
    </>
  );
}