"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminNavIcon } from "@/components/admin/admin-icons";
import { LogoutButton } from "@/components/auth/logout-button";
import { adminNavItems } from "@/lib/admin/nav";

interface AdminSidebarProps {
  collapsed: boolean;
}

export function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-brand-800 bg-brand-800 text-white transition-[width] duration-300 ${
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
          className="h-10 w-10 shrink-0 rounded-full object-contain"
        />
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Benedicto College</p>
            <p className="truncate text-xs text-blue-100">Admin Portal</p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {adminNavItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
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
              <AdminNavIcon icon={item.icon} />
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
