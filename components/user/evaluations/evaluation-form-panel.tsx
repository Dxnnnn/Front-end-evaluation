"use client";

import { useEffect, useState, type FormEvent } from "react";

import { getSurveyQuestions } from "@/lib/evaluations/storage";
import { getFaculty } from "@/lib/faculty/storage";
import { addEvaluationSubmission } from "@/lib/user/evaluation-submissions";
import type { Faculty } from "@/lib/types/faculty";
import type { SurveyQuestion } from "@/lib/types/survey-question";
import { scoringScale } from "@/lib/types/survey-question";

export function EvaluationFormPanel() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [facultyId, setFacultyId] = useState("");
  const [subject, setSubject] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedFaculty = faculty.find((member) => member.id === facultyId);
  const availableSubjects = selectedFaculty?.subjects ?? [];

  useEffect(() => {
    setFaculty(getFaculty());
    setQuestions(getSurveyQuestions());
  }, []);

  useEffect(() => {
    if (!facultyId) {
      setSubject("");
      return;
    }

    const member = faculty.find((item) => item.id === facultyId);
    const subjects = member?.subjects ?? [];

    if (subjects.length === 1) {
      setSubject(subjects[0]);
      return;
    }

    setSubject("");
  }, [facultyId, faculty]);

  function handleFacultyChange(nextFacultyId: string) {
    setFacultyId(nextFacultyId);
    setSubject("");
  }

  function handleScoreChange(questionId: string, score: number) {
    setAnswers((current) => ({
      ...current,
      [questionId]: score,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedFaculty) {
      setError("Please select a faculty member to evaluate.");
      return;
    }

    if (!subject) {
      setError("Please select a subject for this evaluation.");
      return;
    }

    if (questions.length === 0) {
      setError("No survey questions are available yet. Contact an administrator.");
      return;
    }

    const unanswered = questions.filter((question) => answers[question.id] === undefined);

    if (unanswered.length > 0) {
      setError("Please answer all survey questions before submitting.");
      return;
    }

    addEvaluationSubmission({
      facultyId: selectedFaculty.id,
      facultyName: selectedFaculty.name,
      department: selectedFaculty.department,
      subject,
      answers,
    });

    setFacultyId("");
    setSubject("");
    setAnswers({});
    setSuccess(
      `Evaluation for ${selectedFaculty.name} (${subject}) submitted successfully.`,
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Faculty details</h2>
        <p className="mt-1 text-sm text-slate-500">
          Select the teacher and subject you are evaluating.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="evaluation-faculty"
              className="block text-sm font-medium text-slate-700"
            >
              Faculty member
            </label>
            <select
              id="evaluation-faculty"
              value={facultyId}
              onChange={(event) => handleFacultyChange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              required
            >
              <option value="">Select faculty...</option>
              {faculty.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.department}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="evaluation-subject"
              className="block text-sm font-medium text-slate-700"
            >
              Subject
            </label>
            <select
              id="evaluation-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              disabled={!selectedFaculty}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              required
            >
              <option value="">
                {selectedFaculty ? "Select subject..." : "Select faculty first..."}
              </option>
              {availableSubjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="flex max-h-[28rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="shrink-0 border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Survey questions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Rate each question from 4 (highest) to 1 (lowest).
          </p>
        </div>

        {questions.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No survey questions have been added yet.
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
            {questions.map((question, index) => (
              <article
                key={question.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-600">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{question.text}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {scoringScale.map((level) => (
                        <label
                          key={level.value}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-brand-300"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={level.value}
                            checked={answers[question.id] === level.value}
                            onChange={() =>
                              handleScoreChange(question.id, level.value)
                            }
                            className="h-4 w-4 border-slate-300 text-brand-700"
                            required
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
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={questions.length === 0}
        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Submit evaluation
      </button>
    </form>
  );
}
