"use client";

import { useEffect, useState } from "react";

import {
  deleteAccount,
  formatAccountDate,
  getAccounts,
  maskPassword,
} from "@/lib/accounts/storage";
import type { Account, AccountRole } from "@/lib/types/account";

interface AccountsListProps {
  role: AccountRole;
  refreshKey: number;
}

export function AccountsList({ role, refreshKey }: AccountsListProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showPasswords, setShowPasswords] = useState(false);

  const isCoordinator = role === "faculty";

  useEffect(() => {
    setAccounts(getAccounts(role));
  }, [role, refreshKey]);

  function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Delete this account?\n\n${name}\n\nThis cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteAccount(id);
    setAccounts(getAccounts(role));
  }

  if (accounts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-600">No accounts yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Add your first {isCoordinator ? "coordinator" : "student"} account
          using the form.
        </p>
      </div>
    );
  }

  return (
    <section className="flex max-h-[28rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {isCoordinator ? "Coordinator accounts" : "Student accounts"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {accounts.length} account{accounts.length === 1 ? "" : "s"} on
            record.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPasswords((current) => !current)}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
          >
            {showPasswords ? (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18M10.58 10.58A2 2 0 0012 13a2 2 0 002.42-2.42M9.88 4.24A10.94 10.94 0 0112 5c5 0 9.27 3.11 10 7a11.8 11.8 0 01-4.12 5.12M6.1 6.1A11.8 11.8 0 003 12c.73 3.89 5 7 10 7 1.12 0 2.19-.16 3.18-.45"
                />
              </>
            ) : (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
                />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
          {showPasswords ? "Hide passwords" : "Show passwords"}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">ID#</th>
              {isCoordinator ? (
                <th className="px-6 py-3 font-medium">Department</th>
              ) : null}
              <th className="px-6 py-3 font-medium">Password</th>
              <th className="px-6 py-3 font-medium">Added</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accounts.map((account) => (
              <tr key={account.id} className="text-slate-700">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {account.name}
                </td>
                <td className="px-6 py-4">{account.username}</td>
                {isCoordinator ? (
                  <td className="px-6 py-4">{account.department ?? "—"}</td>
                ) : null}
                <td className="px-6 py-4 font-mono text-xs">
                  {showPasswords ? account.password : maskPassword(account.password)}
                </td>
                <td className="px-6 py-4">
                  {formatAccountDate(account.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(account.id, account.name)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
