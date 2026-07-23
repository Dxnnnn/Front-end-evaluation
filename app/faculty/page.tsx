import Link from "next/link";

import {
  facultyDashboardStats,
  facultyRecentEvaluations,
} from "@/lib/faculty-portal/nav";

export default function FacultyPortalDashboardPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Coordinator Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              View evaluation scores and student feedback summaries.
            </p>
          </div>

          <Link
            href="/faculty/reports"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 19.5V5.5h16v14"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 15.5v-4M12 15.5V8.5M16 15.5v-2"
              />
            </svg>
            View reports
          </Link>
        </div>
      </header>

      <main className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-8 sm:px-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {facultyDashboardStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-slate-500">{stat.change}</p>
            </article>
          ))}
        </section>

        <section className="flex max-h-[28rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="shrink-0 border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Faculty evaluation scores
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Overall scores for faculty under your coordination.
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Subject</th>
                  <th className="px-6 py-3 font-medium">Overall score</th>
                  <th className="px-6 py-3 font-medium">Evaluations</th>
                  <th className="px-6 py-3 font-medium">Last updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facultyRecentEvaluations.map((row) => (
                  <tr key={row.subject} className="text-slate-700">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {row.subject}
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-700">
                      {row.score}
                    </td>
                    <td className="px-6 py-4">{row.evaluations}</td>
                    <td className="px-6 py-4">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
