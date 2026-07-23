"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { FacultyPortalNavIcon } from "@/components/faculty-portal/faculty-portal-icons";
import { facultyPortalNavItems } from "@/lib/faculty-portal/nav";

interface FacultyPortalSidebarProps {
  collapsed: boolean;
}

export function FacultyPortalSidebar({ collapsed }: FacultyPortalSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-blue-800 bg-blue-800 text-white transition-[width] duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`flex items-center border-b border-white/10 ${
          collapsed ? "justify-center px-3 py-5" : "gap-3 px-5 py-5"
        }`}
      >
        <Image
          src="/icons/sidebar-logo.png"
          alt="Benedicto College logo"
          width={40}
          height={40}
          unoptimized
          className="h-20 w-20 shrink-0 rounded-full object-contain"
        />
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Benedicto College</p>
            <p className="truncate text-xs text-blue-100">Coordinator Portal</p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {facultyPortalNavItems.map((item) => {
          const isActive =
            item.href === "/faculty"
              ? pathname === "/faculty"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                collapsed ? "justify-center" : "gap-3"
              } ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <FacultyPortalNavIcon icon={item.icon} />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <LogoutButton
          collapsed={collapsed}
          className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-blue-100 transition hover:bg-white/10 hover:text-white ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        />
      </div>
    </aside>
  );
}
