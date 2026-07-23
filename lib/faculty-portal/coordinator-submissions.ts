import type {
  EvaluationSubmission,
  NewEvaluationSubmission,
} from "@/lib/types/evaluation-submission";

const STORAGE_KEY = "eval_coordinator_submissions";

function normalizeScoringAnswers(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>)
      .map(([key, value]) => [key, Number(value)])
      .filter(([, value]) => !Number.isNaN(value)),
  );
}

function normalizePersonalAnswers(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>).map(([key, value]) => [
      key,
      String(value ?? ""),
    ]),
  );
}

function normalizeSubmission(
  submission: EvaluationSubmission & {
    answers?: Record<string, unknown>;
  },
): EvaluationSubmission {
  if (submission.scoringAnswers || submission.personalAnswers) {
    return {
      ...submission,
      subject: submission.subject ?? "General Subject",
      scoringAnswers: normalizeScoringAnswers(submission.scoringAnswers),
      personalAnswers: normalizePersonalAnswers(submission.personalAnswers),
    };
  }

  const legacyAnswers = submission.answers ?? {};
  const scoringAnswers: Record<string, number> = {};
  const personalAnswers: Record<string, string> = {};

  for (const [key, value] of Object.entries(legacyAnswers)) {
    const numeric = Number(value);

    if (
      typeof value === "number" ||
      (typeof value === "string" &&
        value.trim() !== "" &&
        !Number.isNaN(numeric) &&
        numeric >= 1 &&
        numeric <= 4)
    ) {
      scoringAnswers[key] = numeric;
    } else {
      personalAnswers[key] = String(value ?? "");
    }
  }

  return {
    ...submission,
    subject: submission.subject ?? "General Subject",
    scoringAnswers,
    personalAnswers,
  };
}

function readSubmissions(): EvaluationSubmission[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Array<
      EvaluationSubmission & { answers?: Record<string, unknown> }
    >;
    return parsed.map(normalizeSubmission);
  } catch {
    return [];
  }
}

function writeSubmissions(submissions: EvaluationSubmission[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

export function getCoordinatorSubmissions(): EvaluationSubmission[] {
  return readSubmissions().sort((a, b) =>
    b.submittedAt.localeCompare(a.submittedAt),
  );
}

export function addCoordinatorSubmission(
  input: NewEvaluationSubmission,
): EvaluationSubmission {
  const submission: EvaluationSubmission = {
    id: crypto.randomUUID(),
    facultyId: input.facultyId,
    facultyName: input.facultyName,
    department: input.department,
    subject: input.subject,
    scoringAnswers: input.scoringAnswers,
    personalAnswers: input.personalAnswers,
    submittedAt: new Date().toISOString(),
  };

  writeSubmissions([submission, ...readSubmissions()]);
  return submission;
}
