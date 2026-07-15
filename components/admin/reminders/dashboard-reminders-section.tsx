"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  formatReminderDate,
  getUpcomingReminders,
} from "@/lib/reminders/storage";
import type { Reminder } from "@/lib/types/reminder";

interface DashboardRemindersSectionProps {
  compact?: boolean;
}

export function DashboardRemindersSection({
  compact = false,
}: DashboardRemindersSectionProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    setReminders(getUpcomingReminders(compact ? 3 : 5));
  }, [compact]);

  const today = new Date().toISOString().slice(0, 10);

  if (compact) {
    return (
      <Link
        href="/admin/reminders"
        className="flex h-full min-h-[148px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
      >
        <div>
          <p className="text-sm font-medium text-slate-500">Reminders</p>
          <p className="mt-1 text-xs text-slate-400">Upcoming schedule</p>
        </div>

        {reminders.length === 0 ? (
          <div className="mt-3 flex flex-1 items-center">
            <p className="text-xs font-medium text-slate-500">+ Add reminder</p>
          </div>
        ) : (
          <ul className="mt-3 flex-1 space-y-2 overflow-y-auto">
            {reminders.map((reminder) => (
              <li
                key={reminder.id}
                className="rounded-lg px-2 py-1.5"
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <p className="truncate text-sm font-medium text-slate-800">
                    {reminder.title}
                  </p>
                </div>
                <p className="mt-0.5 pl-3 text-xs text-slate-500">
                  {reminder.scheduledDate === today
                    ? "Today"
                    : formatReminderDate(reminder.scheduledDate)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Link>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Upcoming Reminders
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Scheduled tasks and notes from your calendar.
          </p>
        </div>
        <Link
          href="/admin/reminders"
          className="text-sm font-medium text-brand-700 transition hover:text-brand-800"
        >
          Manage
        </Link>
      </div>

      {reminders.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-slate-500">No upcoming reminders.</p>
          <Link
            href="/admin/reminders"
            className="mt-2 inline-block text-sm font-medium text-brand-700 transition hover:text-brand-800"
          >
            Create a reminder
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {reminders.map((reminder) => {
            const isToday = reminder.scheduledDate === today;

            return (
              <li key={reminder.id}>
                <Link
                  href="/admin/reminders"
                  className="flex items-start justify-between gap-4 px-6 py-4 transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                      <p className="truncate font-medium text-slate-900">
                        {reminder.title}
                      </p>
                      {isToday ? (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Today
                        </span>
                      ) : null}
                    </div>
                    {reminder.note ? (
                      <p className="mt-1 truncate pl-4 text-sm text-slate-500">
                        {reminder.note}
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 text-sm text-slate-500">
                    {formatReminderDate(reminder.scheduledDate)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
