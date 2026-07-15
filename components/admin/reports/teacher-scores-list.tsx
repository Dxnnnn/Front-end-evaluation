import { teacherScores } from "@/lib/reports/teacher-scores";
import { maxOverallScore } from "@/lib/types/teacher-score";

function scoreBarClass(score: number) {
  if (score >= 3.75) {
    return "bg-emerald-500";
  }

  if (score >= 3.5) {
    return "bg-brand-500";
  }

  if (score >= 3) {
    return "bg-amber-500";
  }

  return "bg-slate-400";
}

export function TeacherScoresList() {
  const sortedTeachers = [...teacherScores].sort(
    (a, b) => b.overallScore - a.overallScore,
  );

  return (
    <section className="flex max-h-[28rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Overall scores by teacher
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Individual average scores based on completed evaluations.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Teacher</th>
              <th className="px-6 py-3 font-medium">Department</th>
              <th className="px-6 py-3 font-medium">Overall score</th>
              <th className="px-6 py-3 font-medium">Evaluations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedTeachers.map((teacher) => {
              const scorePercent = (teacher.overallScore / maxOverallScore) * 100;

              return (
                <tr key={teacher.id} className="text-slate-700">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-4">{teacher.department}</td>
                  <td className="px-6 py-4">
                    <div className="flex min-w-[180px] items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${scoreBarClass(teacher.overallScore)}`}
                          style={{ width: `${scorePercent}%` }}
                        />
                      </div>
                      <span className="w-14 text-right font-semibold text-slate-900">
                        {teacher.overallScore.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{teacher.evaluationCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
