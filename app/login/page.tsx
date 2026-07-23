import Image from "next/image";

import { AuthPanel } from "@/components/auth/auth-panel";
import { getLogoSrc } from "@/lib/get-logo-src";

export default function LoginPage() {
  const logoSrc = getLogoSrc();

  return (
    <div className="relative min-h-screen overflow-y-auto bg-slate-100 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(30,64,175,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(243,109,33,0.12),transparent_38%)]" />

      <div className="relative mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src={logoSrc}
            alt="Benedicto College logo"
            width={120}
            height={120}
            priority
            unoptimized
            className="mx-auto mb-4 h-28 w-28 object-contain drop-shadow-md"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Teacher Evaluation Form
          </h1>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-200/70 backdrop-blur">
          <AuthPanel />
        </div>
      </div>
    </div>
  );
}
