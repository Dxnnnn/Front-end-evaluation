export type ScoreLevelKey = 4 | 3 | 2 | 1;

export interface ScoreDistribution {
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface TeacherScore {
  id: string;
  name: string;
  department: string;
  overallScore: number;
  evaluationCount: number;
  scoreDistribution: ScoreDistribution;
}

export const maxOverallScore = 4;
