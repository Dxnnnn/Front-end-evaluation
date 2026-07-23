"use client";

import { useEffect, useState } from "react";

import {
  deleteSurveyQuestion,
  getSurveyQuestions,
} from "@/lib/evaluations/storage";
import {
  scoringScale,
  type QuestionSection,
  type SurveyAudience,
  type SurveyQuestion,
} from "@/lib/types/survey-question";
import { questionSectionLabels } from "@/lib/types/survey-question";

interface SurveyQuestionsListProps {
  audience: SurveyAudience;
  section: QuestionSection;
  refreshKey: number;
}

export function SurveyQuestionsList({
  audience,
  section,
  refreshKey,
}: SurveyQuestionsListProps) {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);

  const isScoring = section === "scoring";

  useEffect(() => {
    setQuestions(getSurveyQuestions(audience, section));
  }, [audience, section, refreshKey]);

  function handleDelete(id: string, text: string) {
    const confirmed = window.confirm(
      `Delete this question?\n\n"${text}"\n\nThis cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteSurveyQuestion(id);
    setQuestions(getSurveyQuestions(audience, section));
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-600">No questions yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Add your first {audience === "student" ? "student" : "coordinator"}{" "}
          {questionSectionLabels[section].toLowerCase()} question using the
          form.
        </p>
      </div>
    );
  }

  return (
    <section className="flex max-h-[28rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {questionSectionLabels[section]}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {questions.length} question{questions.length === 1 ? "" : "s"} on
          record.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {questions.map((question, index) => (
          <article
            key={question.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    {index + 1}
                  </span>
                  <p className="font-medium text-slate-900">{question.text}</p>
                </div>

                <div className="mt-4 pl-9">
                  <p className="mb-2 text-xs font-medium text-slate-500">
                    Preview
                  </p>
                  {isScoring ? (
                    <div className="flex flex-wrap gap-3">
                      {scoringScale.map((level) => (
                        <label
                          key={level.value}
                          className="inline-flex cursor-default items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                        >
                          <input
                            type="checkbox"
                            disabled
                            className="h-4 w-4 rounded border-slate-300 text-brand-700"
                            aria-label={`${level.value} - ${level.label}`}
                          />
                          <span className="text-sm font-medium text-slate-700">
                            {level.value}
                          </span>
                          <span className="text-xs text-slate-500">
                            {level.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      readOnly
                      rows={3}
                      placeholder="Type your response here..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                    />
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(question.id, question.text)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-100"
                aria-label={`Delete question ${index + 1}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 7h12M10 11v6M14 11v6M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0h10l-1 12a1 1 0 01-1 1H9a1 1 0 01-1-1L7 7z"
                  />
                </svg>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
