export interface EvaluationSubmission {
  id: string;
  facultyId: string;
  facultyName: string;
  department: string;
  subject: string;
  answers: Record<string, number>;
  submittedAt: string;
}

export interface NewEvaluationSubmission {
  facultyId: string;
  facultyName: string;
  department: string;
  subject: string;
  answers: Record<string, number>;
}
