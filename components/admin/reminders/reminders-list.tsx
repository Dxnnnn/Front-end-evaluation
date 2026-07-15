"use client";

import { useEffect, useState } from "react";

import {
  deleteReminder,
  formatReminderDate,
  getReminders,
} from "@/lib/reminders/storage";
import type { Reminder } from "@/lib/types/reminder";

interface RemindersListProps {
  refreshKey: number;
}

export function RemindersList({ refreshKey }: RemindersListProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    setReminders(getReminders());
  }, [refreshKey]);

  function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(
      `Delete reminder "${title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteReminder(id);
    setReminders(getReminders());
  }

  if (reminders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-600">No reminders yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Create one using the form to schedule it on your calendar.
        </p>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="flex max-h-[28rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Scheduled reminders</h2>
        <p className="mt-1 text-sm text-slate-500">
          {reminders.length} reminder{reminders.length === 1 ? "" : "s"} on record.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
      {reminders.map((reminder) => {
        const isPast = reminder.scheduledDate < today;
        const isToday = reminder.scheduledDate === today;

        return (
          <article
            key={reminder.id}
            className={`rounded-2xl border bg-white p-5 shadow-sm ${
              isPast ? "border-slate-200 opacity-70" : "border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-slate-900">{reminder.title}</h3>
                  {isToday ? (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Today
                    </span>
                  ) : null}
                  {isPast ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                      Past
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {formatReminderDate(reminder.scheduledDate)}
                </p>
                {reminder.note ? (
                  <p className="mt-2 text-sm text-slate-600">{reminder.note}</p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => handleDelete(reminder.id, reminder.title)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-100"
                aria-label={`Delete reminder: ${reminder.title}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 7h12M10 11v6M14 11v6M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0h10l-1 12a1 1 0 01-1 1H9a1 1 0 01-1-1L7 7z"
                  />
                </svg>
                Delete
              </button>
            </div>
          </article>
        );
      })}
      </div>
    </section>
  );
}
