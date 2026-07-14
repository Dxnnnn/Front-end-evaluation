"use client";

import { useState } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";

type AuthMode = "login" | "signup";

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <>
      <div className="mb-6">
        {mode === "login" ? (
          <>
            <h2 className="text-lg font-semibold text-slate-900">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-500">
              Sign in with your existing admin or faculty account.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-slate-900">Create an account</h2>
            <p className="mt-1 text-sm text-slate-500">
              New users can register here to access the evaluation form.
            </p>
          </>
        )}
      </div>

      {mode === "login" ? <LoginForm /> : <SignupForm />}

      {mode === "login" ? (
        <>
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            <p className="font-medium text-slate-600">Demo accounts</p>
            <p className="mt-1">
              Admin: <span className="font-mono">admin / admin123</span>
            </p>
            <p>
              User: <span className="font-mono">user / user123</span>
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="font-medium text-brand-700 transition hover:text-brand-800"
            >
              Sign up
            </button>
          </p>
        </>
      ) : (
        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setMode("login")}
            className="font-medium text-brand-700 transition hover:text-brand-800"
          >
            Log in instead
          </button>
        </p>
      )}
    </>
  );
}
