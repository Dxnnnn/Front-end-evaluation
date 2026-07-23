"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

import { getSurveyQuestions } from "@/lib/evaluations/storage";
import { addCoordinatorSubmission } from "@/lib/faculty-portal/coordinator-submissions";
import { getFaculty } from "@/lib/faculty/storage";
import { addEvaluationSubmission } from "@/lib/user/evaluation-submissions";
import type { Faculty } from "@/lib/types/faculty";
import type { SurveyAudience, SurveyQuestion } from "@/lib/types/survey-question";
import { scoringScale } from "@/lib/types/survey-question";

interface EvaluationFormPanelProps {
  audience?: SurveyAudience;
  departmentFilter?: string;
}

function QuestionSection({
  title,
  description,
  children,
  emptyMessage,
  isEmpty,
}: {
  title: string;
  description: string;
  children: ReactNode;
  emptyMessage: string;
  isEmpty: boolean;
}) {
  return (
    <section className="flex max-h-[28rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {isEmpty ? (
        <div className="px-6 py-12 text-center text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          {children}
        </div>
      )}
    </section>
  );
}

export function EvaluationFormPanel({
  audience = "student",
  departmentFilter,
}: EvaluationFormPanelProps) {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [scoringQuestions, setScoringQuestions] = useState<SurveyQuestion[]>(
    [],
  );
  const [personalQuestions, setPersonalQuestions] = useState<SurveyQuestion[]>(
    [],
  );
  const [facultyId, setFacultyId] = useState("");
  const [subject, setSubject] = useState("");
  const [scoringAnswers, setScoringAnswers] = useState<Record<string, number>>(
    {},
  );
  const [personalAnswers, setPersonalAnswers] = useState<Record<string, string>>(
    {},
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isCoordinatorForm = audience === "coordinator";
  const selectedFaculty = faculty.find((member) => member.id === facultyId);
  const availableSubjects = selectedFaculty?.subjects ?? [];
  const hasQuestions = useMemo(
    () => scoringQuestions.length > 0 || personalQuestions.length > 0,
    [scoringQuestions.length, personalQuestions.length],
  );

  useEffect(() => {
    const allFaculty = getFaculty();

    if (departmentFilter) {
      const normalized = departmentFilter.trim().toLowerCase();
      setFaculty(
        allFaculty.filter(
          (member) =>
            member.department.trim().toLowerCase() === normalized,
        ),
      );
    } else {
      setFaculty(allFaculty);
    }

    setScoringQuestions(getSurveyQuestions(audience, "scoring"));
    setPersonalQuestions(getSurveyQuestions(audience, "personal"));
  }, [audience, departmentFilter]);

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
    setScoringAnswers((current) => ({
      ...current,
      [questionId]: score,
    }));
  }

  function handlePersonalAnswerChange(questionId: string, value: string) {
    setPersonalAnswers((current) => ({
      ...current,
      [questionId]: value,
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

    if (!hasQuestions) {
      setError("No survey questions are available yet. Contact an administrator.");
      return;
    }

    const unansweredScoring = scoringQuestions.filter(
      (question) => scoringAnswers[question.id] === undefined,
    );
    const unansweredPersonal = personalQuestions.filter(
      (question) => !personalAnswers[question.id]?.trim(),
    );

    if (unansweredScoring.length > 0 || unansweredPersonal.length > 0) {
      setError("Please answer all survey questions before submitting.");
      return;
    }

    const submissionInput = {
      facultyId: selectedFaculty.id,
      facultyName: selectedFaculty.name,
      department: selectedFaculty.department,
      subject,
      scoringAnswers: Object.fromEntries(
        scoringQuestions.map((question) => [
          question.id,
          scoringAnswers[question.id],
        ]),
      ),
      personalAnswers: Object.fromEntries(
        personalQuestions.map((question) => [
          question.id,
          personalAnswers[question.id].trim(),
        ]),
      ),
    };

    if (isCoordinatorForm) {
      addCoordinatorSubmission(submissionInput);
    } else {
      addEvaluationSubmission(submissionInput);
    }

    setFacultyId("");
    setSubject("");
    setScoringAnswers({});
    setPersonalAnswers({});
    setSuccess(
      `Evaluation for ${selectedFaculty.name} (${subject}) submitted successfully.`,
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Faculty details</h2>
        <p className="mt-1 text-sm text-slate-500">
          {isCoordinatorForm
            ? "Select a teacher from your department and the subject you are evaluating."
            : "Select the teacher and subject you are evaluating."}
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
                  {member.name}
                  {!departmentFilter ? ` - ${member.department}` : ""}
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

      <QuestionSection
        title="Part 1: Scoring scale"
        description="Rate each question from 4 (highest) to 1 (lowest)."
        isEmpty={scoringQuestions.length === 0}
        emptyMessage={`No ${isCoordinatorForm ? "coordinator" : "student"} scoring questions have been added yet.`}
      >
        {scoringQuestions.map((question, index) => (
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
                        checked={scoringAnswers[question.id] === level.value}
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
      </QuestionSection>

      <QuestionSection
        title="Part 2: Personal questionnaire"
        description="Type your written response for each open-ended question."
        isEmpty={personalQuestions.length === 0}
        emptyMessage={`No ${isCoordinatorForm ? "coordinator" : "student"} personal questions have been added yet.`}
      >
        {personalQuestions.map((question, index) => (
          <article
            key={question.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-600">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={`personal-${question.id}`}
                  className="block font-medium text-slate-900"
                >
                  {question.text}
                </label>
                <textarea
                  id={`personal-${question.id}`}
                  value={personalAnswers[question.id] ?? ""}
                  onChange={(event) =>
                    handlePersonalAnswerChange(question.id, event.target.value)
                  }
                  rows={4}
                  placeholder="Type your response here..."
                  className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  required
                />
              </div>
            </div>
          </article>
        ))}
      </QuestionSection>

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
        disabled={!hasQuestions}
        className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
          isCoordinatorForm
            ? "bg-brand-700 hover:bg-brand-800"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        Submit evaluation
      </button>
    </form>
  );
}
