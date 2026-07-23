"use client";

import { useState, type FormEvent } from "react";

import { addSurveyQuestion } from "@/lib/evaluations/storage";
import type { QuestionSection, SurveyAudience } from "@/lib/types/survey-question";
import { questionSectionLabels } from "@/lib/types/survey-question";

interface SurveyQuestionFormProps {
  audience: SurveyAudience;
  section: QuestionSection;
  onCreated: () => void;
}

export function SurveyQuestionForm({
  audience,
  section,
  onCreated,
}: SurveyQuestionFormProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const isScoring = section === "scoring";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Question text is required.");
      return;
    }

    addSurveyQuestion({ text, audience, section });
    setText("");
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Add question</h2>
      <p className="mt-1 text-sm text-slate-500">
        Create a {audience === "student" ? "student" : "coordinator"}{" "}
        {questionSectionLabels[section].toLowerCase()} question
        {isScoring ? " rated from 4 to 1" : " answered with a textbox"}.
      </p>

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="question-text"
            className="block text-sm font-medium text-slate-700"
          >
            Question
          </label>
          <textarea
            id="question-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={
              isScoring
                ? "e.g. The instructor explains lessons clearly."
                : "e.g. What could the instructor improve?"
            }
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            required
          />
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="flex w-full shrink-0 items-center justify-center rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
        >
          Add question
        </button>
      </div>
    </form>
  );
}
