import { scoringScale } from "@/lib/types/survey-question";

export function ScoringGuide() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Part 1: Scoring scale</h2>
      <p className="mt-1 text-sm text-slate-500">
        These questions use a 4–1 scale, with 4 as the highest and 1 as the
        lowest.
      </p>

      <ul className="mt-4 space-y-2">
        {scoringScale.map((level) => (
          <li
            key={level.value}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-white">
                {level.value}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {level.label}
                </p>
                <p className="text-xs text-slate-500">{level.description}</p>
              </div>
            </div>
            {level.value === 4 ? (
              <span className="text-xs font-medium text-emerald-600">Highest</span>
            ) : null}
            {level.value === 1 ? (
              <span className="text-xs font-medium text-slate-500">Lowest</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
