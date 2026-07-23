export interface EvaluationSubmission {
  id: string;
  facultyId: string;
  facultyName: string;
  department: string;
  subject: string;
  scoringAnswers: Record<string, number>;
  personalAnswers: Record<string, string>;
  submittedAt: string;
}

export interface NewEvaluationSubmission {
  facultyId: string;
  facultyName: string;
  department: string;
  subject: string;
  scoringAnswers: Record<string, number>;
  personalAnswers: Record<string, string>;
}
