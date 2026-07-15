export interface Reminder {
  id: string;
  title: string;
  note?: string;
  scheduledDate: string;
  createdAt: string;
}

export interface NewReminder {
  title: string;
  note?: string;
  scheduledDate: string;
}
