"use client";

import { useState, type FormEvent } from "react";

import { addFaculty, parseSubjectsInput } from "@/lib/faculty/storage";

interface FacultyFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

export function FacultyForm({ onCreated, onCancel }: FacultyFormProps) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [subjects, setSubjects] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsedSubjects = parseSubjectsInput(subjects);

    if (!name.trim() || !department.trim()) {
      setError("Name and department are required.");
      return;
    }

    if (parsedSubjects.length === 0) {
      setError("Add at least one subject.");
      return;
    }

    addFaculty({ name, department, subjects: parsedSubjects });
    setName("");
    setDepartment("");
    setSubjects("");
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Add new faculty</h2>
      <p className="mt-1 text-sm text-slate-500">
        Enter the faculty member&apos;s name, department, and subjects.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="faculty-name"
            className="block text-sm font-medium text-slate-700"
          >
            Name
          </label>
          <input
            id="faculty-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Dr. Maria Santos"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="faculty-department"
            className="block text-sm font-medium text-slate-700"
          >
            Department
          </label>
          <input
            id="faculty-department"
            type="text"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            placeholder="e.g. Computer Science"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            required
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor="faculty-subjects"
            className="block text-sm font-medium text-slate-700"
          >
            Subjects
          </label>
          <input
            id="faculty-subjects"
            type="text"
            value={subjects}
            onChange={(event) => setSubjects(event.target.value)}
            placeholder="e.g. Programming 1, Data Structures"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            required
          />
          <p className="text-xs text-slate-500">
            Separate multiple subjects with commas.
          </p>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
        >
          Save faculty
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
