import type { NewReminder, Reminder } from "@/lib/types/reminder";

const STORAGE_KEY = "eval_admin_reminders";

function readReminders(): Reminder[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Reminder[];
  } catch {
    return [];
  }
}

function writeReminders(reminders: Reminder[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

export function getReminders(): Reminder[] {
  return readReminders().sort((a, b) =>
    a.scheduledDate.localeCompare(b.scheduledDate),
  );
}

export function getUpcomingReminders(limit = 3): Reminder[] {
  const today = new Date().toISOString().slice(0, 10);

  return getReminders()
    .filter((reminder) => reminder.scheduledDate >= today)
    .slice(0, limit);
}

export function addReminder(input: NewReminder): Reminder {
  const reminder: Reminder = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    note: input.note?.trim() || undefined,
    scheduledDate: input.scheduledDate,
    createdAt: new Date().toISOString(),
  };

  writeReminders([...readReminders(), reminder]);
  return reminder;
}

export function deleteReminder(id: string) {
  writeReminders(readReminders().filter((reminder) => reminder.id !== id));
}

export function formatReminderDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
