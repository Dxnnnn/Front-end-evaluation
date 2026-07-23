"use client";

import { useState } from "react";

import { AccountAudienceSwitch } from "@/components/admin/accounts/account-audience-switch";
import { AccountForm } from "@/components/admin/accounts/account-form";
import { AccountsList } from "@/components/admin/accounts/accounts-list";
import type { AccountRole } from "@/lib/types/account";

export function AccountsPanel() {
  const [role, setRole] = useState<AccountRole>("user");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <AccountAudienceSwitch audience={role} onChange={setRole} />

      <section className="grid gap-6 lg:grid-cols-[360px_1fr] lg:items-start">
        <AccountForm
          role={role}
          onCreated={() => setRefreshKey((current) => current + 1)}
        />
        <AccountsList role={role} refreshKey={refreshKey} />
      </section>
    </div>
  );
}
