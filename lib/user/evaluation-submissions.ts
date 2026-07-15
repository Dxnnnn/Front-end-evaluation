import type {
  EvaluationSubmission,
  NewEvaluationSubmission,
} from "@/lib/types/evaluation-submission";

const STORAGE_KEY = "eval_user_submissions";

function readSubmissions(): EvaluationSubmission[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as EvaluationSubmission[];
  } catch {
    return [];
  }
}

function writeSubmissions(submissions: EvaluationSubmission[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

export function getEvaluationSubmissions(): EvaluationSubmission[] {
  return readSubmissions()
    .map((submission) => ({
      ...submission,
      subject: submission.subject ?? "General Subject",
    }))
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export function getOverallScore(answers: Record<string, number>): number {
  const scores = Object.values(answers);

  if (scores.length === 0) {
    return 0;
  }

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function formatSubmissionDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function addEvaluationSubmission(
  input: NewEvaluationSubmission,
): EvaluationSubmission {
  const submission: EvaluationSubmission = {
    id: crypto.randomUUID(),
    facultyId: input.facultyId,
    facultyName: input.facultyName,
    department: input.department,
    subject: input.subject,
    answers: input.answers,
    submittedAt: new Date().toISOString(),
  };

  writeSubmissions([submission, ...readSubmissions()]);
  return submission;
}
