import {
  getCombinedScoreDistribution,
  getOverallAverageScore,
  getScoreSlices,
  getTotalResponses,
  teacherScores,
} from "@/lib/reports/teacher-scores";
import type { ScoreSlice } from "@/lib/reports/teacher-scores";
import { maxOverallScore } from "@/lib/types/teacher-score";

const size = 220;
const radius = 90;
const center = size / 2;

function polarToCartesian(angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

function describeSlice(startAngle: number, endAngle: number) {
  const start = polarToCartesian(endAngle);
  const end = polarToCartesian(startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${center} ${center}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function buildSlicePaths(slices: ScoreSlice[]) {
  let currentAngle = 0;

  return slices
    .filter((slice) => slice.count > 0)
    .map((slice) => {
      const sweep = (slice.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sweep;
      currentAngle = endAngle;

      return {
        ...slice,
        path: describeSlice(startAngle, endAngle),
      };
    });
}

export function OverallScorePieChart() {
  const distribution = getCombinedScoreDistribution();
  const slices = getScoreSlices(distribution);
  const slicePaths = buildSlicePaths(slices);
  const overallAverage = getOverallAverageScore();
  const totalResponses = getTotalResponses(distribution);
  const totalEvaluations = teacherScores.reduce(
    (sum, teacher) => sum + teacher.evaluationCount,
    0,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Overall average score
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Combined review scores across all {teacherScores.length} teachers and{" "}
            {totalEvaluations} evaluations.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span className="font-medium text-slate-900">{totalResponses}</span> total
          responses recorded
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
        <div className="relative shrink-0">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="h-56 w-56"
            role="img"
            aria-label="Overall score distribution pie chart"
          >
            {slicePaths.length > 0 ? (
              slicePaths.map((slice) => (
                <path
                  key={slice.value}
                  d={slice.path}
                  fill={slice.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              ))
            ) : (
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="#e2e8f0"
              />
            )}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <p
              className="text-3xl font-semibold text-white"
              style={{ WebkitTextStroke: "1.5px #000" }}
            >
              {overallAverage.toFixed(2)}
            </p>
            <p
              className="text-xs text-white"
              style={{ WebkitTextStroke: "0.75px #000" }}
            >
              out of {maxOverallScore}
            </p>
          </div>
        </div>

        <ul className="w-full max-w-md space-y-3">
          {slices.map((slice) => (
            <li
              key={slice.value}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {slice.value} - {slice.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    {slice.count} responses
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {slice.percentage.toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
