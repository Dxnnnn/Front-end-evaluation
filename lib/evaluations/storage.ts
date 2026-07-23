import type {
  NewSurveyQuestion,
  QuestionSection,
  SurveyAudience,
  SurveyQuestion,
} from "@/lib/types/survey-question";

const STORAGE_KEY = "eval_survey_questions";

function normalizeQuestion(record: unknown): SurveyQuestion {
  const question = record as Partial<SurveyQuestion>;

  return {
    id: question.id ?? crypto.randomUUID(),
    text: question.text ?? "",
    audience: question.audience ?? "student",
    section: question.section ?? "personal",
    createdAt: question.createdAt ?? new Date().toISOString(),
  };
}

function readQuestions(): SurveyQuestion[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown[];
    const normalized = parsed.map(normalizeQuestion);
    writeQuestions(normalized);
    return normalized;
  } catch {
    return [];
  }
}

function writeQuestions(questions: SurveyQuestion[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export function getSurveyQuestions(
  audience: SurveyAudience,
  section?: QuestionSection,
): SurveyQuestion[] {
  return readQuestions().filter((question) => {
    if (question.audience !== audience) {
      return false;
    }

    if (section) {
      return question.section === section;
    }

    return true;
  });
}

export function addSurveyQuestion(input: NewSurveyQuestion): SurveyQuestion {
  const question: SurveyQuestion = {
    id: crypto.randomUUID(),
    text: input.text.trim(),
    audience: input.audience,
    section: input.section,
    createdAt: new Date().toISOString(),
  };

  writeQuestions([...readQuestions(), question]);
  return question;
}

export function deleteSurveyQuestion(id: string) {
  writeQuestions(readQuestions().filter((question) => question.id !== id));
}
