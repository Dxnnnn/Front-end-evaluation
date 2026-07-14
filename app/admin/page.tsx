import { dashboardStats, recentEvaluations } from "@/lib/admin/nav";

function statusClass(status: string) {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700";
    case "Pending":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-blue-50 text-blue-700";
  }
}

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of teacher evaluation activity and progress.
        </p>
      </header>

      <main className="flex-1 space-y-8 overflow-y-auto px-6 py-8 sm:px-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
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

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Evaluations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest faculty evaluation submissions and reviews.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Faculty</th>
                  <th className="px-6 py-3 font-medium">Department</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentEvaluations.map((row) => (
                  <tr key={`${row.faculty}-${row.date}`} className="text-slate-700">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {row.faculty}
                    </td>
                    <td className="px-6 py-4">{row.department}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
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
