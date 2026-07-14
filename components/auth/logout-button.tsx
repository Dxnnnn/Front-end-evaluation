"use client";

import { useRouter } from "next/navigation";

import { LogoutIcon } from "@/components/admin/admin-icons";

interface LogoutButtonProps {
  className?: string;
  showLabel?: boolean;
  collapsed?: boolean;
}

export function LogoutButton({
  className = "",
  showLabel = true,
  collapsed = false,
}: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      title={collapsed ? "Log out" : undefined}
      className={className}
    >
      <LogoutIcon />
      {showLabel && !collapsed ? <span>Log out</span> : null}
    </button>
  );
}
