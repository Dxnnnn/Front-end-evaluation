import type {
  ScoreDistribution,
  ScoreLevelKey,
  TeacherScore,
} from "@/lib/types/teacher-score";
import { scoringScale } from "@/lib/types/survey-question";

export const teacherScores: TeacherScore[] = [
  {
    id: "1",
    name: "Dr. Maria Santos",
    department: "Computer Science",
    overallScore: 3.92,
    evaluationCount: 28,
    scoreDistribution: { 4: 142, 3: 68, 2: 18, 1: 4 },
  },
  {
    id: "2",
    name: "Prof. James Lim",
    department: "Mathematics",
    overallScore: 3.74,
    evaluationCount: 24,
    scoreDistribution: { 4: 98, 3: 82, 2: 34, 1: 12 },
  },
  {
    id: "3",
    name: "Dr. Ana Reyes",
    department: "English",
    overallScore: 3.58,
    evaluationCount: 22,
    scoreDistribution: { 4: 76, 3: 88, 2: 42, 1: 18 },
  },
  {
    id: "4",
    name: "Prof. Carlo Mendoza",
    department: "Business",
    overallScore: 3.41,
    evaluationCount: 20,
    scoreDistribution: { 4: 58, 3: 72, 2: 56, 1: 26 },
  },
  {
    id: "5",
    name: "Dr. Elena Cruz",
    department: "Nursing",
    overallScore: 3.86,
    evaluationCount: 26,
    scoreDistribution: { 4: 118, 3: 74, 2: 22, 1: 8 },
  },
  {
    id: "6",
    name: "Prof. Mark Villanueva",
    department: "Engineering",
    overallScore: 3.29,
    evaluationCount: 18,
    scoreDistribution: { 4: 42, 3: 64, 2: 58, 1: 32 },
  },
];

export interface ScoreSlice {
  value: ScoreLevelKey;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

const sliceColors: Record<ScoreLevelKey, string> = {
  4: "#10b981",
  3: "#3b82f6",
  2: "#f59e0b",
  1: "#94a3b8",
};

export function getCombinedScoreDistribution(): ScoreDistribution {
  return teacherScores.reduce(
    (combined, teacher) => ({
      4: combined[4] + teacher.scoreDistribution[4],
      3: combined[3] + teacher.scoreDistribution[3],
      2: combined[2] + teacher.scoreDistribution[2],
      1: combined[1] + teacher.scoreDistribution[1],
    }),
    { 4: 0, 3: 0, 2: 0, 1: 0 },
  );
}

export function getTotalResponses(distribution: ScoreDistribution): number {
  return distribution[4] + distribution[3] + distribution[2] + distribution[1];
}

export function getOverallAverageScore(): number {
  const distribution = getCombinedScoreDistribution();
  const total = getTotalResponses(distribution);

  if (total === 0) {
    return 0;
  }

  const weightedTotal =
    distribution[4] * 4 +
    distribution[3] * 3 +
    distribution[2] * 2 +
    distribution[1] * 1;

  return weightedTotal / total;
}

export function getScoreSlices(distribution: ScoreDistribution): ScoreSlice[] {
  const total = getTotalResponses(distribution);

  return scoringScale.map((level) => {
    const value = level.value as ScoreLevelKey;
    const count = distribution[value];

    return {
      value,
      label: level.label,
      count,
      percentage: total === 0 ? 0 : (count / total) * 100,
      color: sliceColors[value],
    };
  });
}
