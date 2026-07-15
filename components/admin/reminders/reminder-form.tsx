"use client";

import { useState, type FormEvent } from "react";

import { addReminder } from "@/lib/reminders/storage";

interface ReminderFormProps {
  onCreated: () => void;
}

export function ReminderForm({ onCreated }: ReminderFormProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !scheduledDate) {
      setError("Title and date are required.");
      return;
    }

    addReminder({
      title,
      note: note || undefined,
      scheduledDate,
    });

    setTitle("");
    setNote("");
    setScheduledDate("");
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">New reminder</h2>
      <p className="mt-1 text-sm text-slate-500">
        Schedule a note for a specific date on the calendar.
      </p>

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="reminder-title"
            className="block text-sm font-medium text-slate-700"
          >
            Title
          </label>
          <input
            id="reminder-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Review faculty evaluations"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="reminder-date"
            className="block text-sm font-medium text-slate-700"
          >
            Date
          </label>
          <input
            id="reminder-date"
            type="date"
            value={scheduledDate}
            onChange={(event) => setScheduledDate(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="reminder-note"
            className="block text-sm font-medium text-slate-700"
          >
            Note <span className="text-slate-400">(optional)</span>
          </label>
          <textarea
            id="reminder-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add extra details..."
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="flex w-full shrink-0 items-center justify-center rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
        >
          Create reminder
        </button>
      </div>
    </form>
  );
}
