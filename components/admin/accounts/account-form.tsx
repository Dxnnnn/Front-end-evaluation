"use client";

import { useState, type FormEvent } from "react";

import { PasswordToggle } from "@/components/auth/password-toggle";
import { addAccount, usernameExists } from "@/lib/accounts/storage";
import type { AccountRole } from "@/lib/types/account";

interface AccountFormProps {
  role: AccountRole;
  onCreated: () => void;
}

export function AccountForm({ role, onCreated }: AccountFormProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isCoordinator = role === "faculty";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !username.trim() || !password) {
      setError("Name, ID#, and password are required.");
      return;
    }

    if (isCoordinator && !department.trim()) {
      setError("Department is required for coordinator accounts.");
      return;
    }

    if (usernameExists(username)) {
      setError("This ID# is already in use.");
      return;
    }

    addAccount({
      name,
      username,
      password,
      role,
      department: isCoordinator ? department : undefined,
    });

    setName("");
    setUsername("");
    setPassword("");
    setDepartment("");
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Add account</h2>
      <p className="mt-1 text-sm text-slate-500">
        Create a new {isCoordinator ? "coordinator" : "student"} login with
        name, ID#, and password.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="account-name"
            className="block text-sm font-medium text-slate-700"
          >
            Name
          </label>
          <input
            id="account-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={isCoordinator ? "e.g. Department Coordinator" : "e.g. Juan Dela Cruz"}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="account-id"
            className="block text-sm font-medium text-slate-700"
          >
            ID#
          </label>
          <input
            id="account-id"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder={isCoordinator ? "e.g. coord-cs" : "e.g. 2024-00123"}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            required
          />
        </div>

        {isCoordinator ? (
          <div className="space-y-2 sm:col-span-2">
            <label
              htmlFor="account-department"
              className="block text-sm font-medium text-slate-700"
            >
              Department
            </label>
            <input
              id="account-department"
              type="text"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              required
            />
          </div>
        ) : null}

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor="account-password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="account-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              required
            />
            <PasswordToggle
              showPassword={showPassword}
              onToggle={() => setShowPassword((current) => !current)}
            />
          </div>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="mt-5 flex w-full shrink-0 items-center justify-center rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
      >
        Add account
      </button>
    </form>
  );
}
