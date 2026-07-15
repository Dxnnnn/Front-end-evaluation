export interface SurveyQuestion {
  id: string;
  text: string;
  createdAt: string;
}

export interface NewSurveyQuestion {
  text: string;
}

export interface ScoreLevel {
  value: number;
  label: string;
  description: string;
}

export const scoringScale: ScoreLevel[] = [
  { value: 4, label: "Excellent", description: "Highest score" },
  { value: 3, label: "Good", description: "Above average" },
  { value: 2, label: "Fair", description: "Below average" },
  { value: 1, label: "Poor", description: "Lowest score" },
];
