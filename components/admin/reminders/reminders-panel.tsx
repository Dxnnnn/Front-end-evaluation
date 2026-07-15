"use client";

import { useState } from "react";

import { ReminderForm } from "@/components/admin/reminders/reminder-form";
import { RemindersList } from "@/components/admin/reminders/reminders-list";

export function RemindersPanel() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
      <ReminderForm onCreated={() => setRefreshKey((current) => current + 1)} />
      <RemindersList refreshKey={refreshKey} />
    </div>
  );
}
