"use client";

import { useState } from "react";

import { FacultyForm } from "@/components/admin/faculty/faculty-form";
import { FacultyList } from "@/components/admin/faculty/faculty-list";

export function FacultyPanel() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleCreated() {
    setShowForm(false);
    setRefreshKey((current) => current + 1);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Faculty</h1>
            <p className="mt-1 text-sm text-slate-500">
              View and manage faculty records.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
            Add new faculty
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-8 sm:px-8">
        {showForm ? (
          <FacultyForm
            onCreated={handleCreated}
            onCancel={() => setShowForm(false)}
          />
        ) : null}
        <FacultyList refreshKey={refreshKey} />
      </main>
    </div>
  );
}
