"use client";

import { LoginForm } from "@/components/auth/login-form";

export function AuthPanel() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in with your admin account to continue.
        </p>
      </div>

      <LoginForm />
    </>
  );
}
