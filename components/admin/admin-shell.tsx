"use client";

import { useEffect, useState } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SidebarEdgeToggle } from "@/components/admin/sidebar-edge-toggle";

interface AdminShellProps {
  children: React.ReactNode;
}

const STORAGE_KEY = "admin-sidebar-collapsed";

export function AdminShell({ children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setCollapsed(true);
    }
  }, [setCollapsed]);

  function handleToggle() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="relative shrink-0">
        <AdminSidebar collapsed={collapsed} />
        <SidebarEdgeToggle collapsed={collapsed} onToggle={handleToggle} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
