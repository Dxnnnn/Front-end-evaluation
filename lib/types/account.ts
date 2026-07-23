import type { UserRole } from "@/lib/types/auth";

export type AccountRole = Extract<UserRole, "user" | "faculty">;

export interface Account {
  id: string;
  name: string;
  username: string;
  password: string;
  role: AccountRole;
  department?: string;
  createdAt: string;
}

export interface NewAccount {
  name: string;
  username: string;
  password: string;
  role: AccountRole;
  department?: string;
}
