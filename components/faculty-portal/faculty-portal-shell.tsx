"use client";

import { useEffect, useState } from "react";

import { SidebarEdgeToggle } from "@/components/admin/sidebar-edge-toggle";
import { FacultyPortalSidebar } from "@/components/faculty-portal/faculty-portal-sidebar";

interface FacultyPortalShellProps {
  children: React.ReactNode;
}

const STORAGE_KEY = "faculty-portal-sidebar-collapsed";

export function FacultyPortalShell({ children }: FacultyPortalShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setCollapsed(true);
    }
  }, []);

  function handleToggle() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <div className="relative shrink-0">
        <FacultyPortalSidebar collapsed={collapsed} />
        <SidebarEdgeToggle collapsed={collapsed} onToggle={handleToggle} />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
