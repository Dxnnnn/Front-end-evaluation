import type { NewSurveyQuestion, SurveyQuestion } from "@/lib/types/survey-question";

const STORAGE_KEY = "eval_survey_questions";

function readQuestions(): SurveyQuestion[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as SurveyQuestion[];
  } catch {
    return [];
  }
}

function writeQuestions(questions: SurveyQuestion[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export function getSurveyQuestions(): SurveyQuestion[] {
  return readQuestions();
}

export function addSurveyQuestion(input: NewSurveyQuestion): SurveyQuestion {
  const question: SurveyQuestion = {
    id: crypto.randomUUID(),
    text: input.text.trim(),
    createdAt: new Date().toISOString(),
  };

  writeQuestions([...readQuestions(), question]);
  return question;
}

export function deleteSurveyQuestion(id: string) {
  writeQuestions(readQuestions().filter((question) => question.id !== id));
}
