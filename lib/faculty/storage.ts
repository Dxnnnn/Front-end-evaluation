import type { Faculty, NewFaculty } from "@/lib/types/faculty";

const STORAGE_KEY = "eval_admin_faculty";

const defaultFaculty: Faculty[] = [
  {
    id: "seed-1",
    name: "Dr. Maria Santos",
    department: "Computer Science",
    subjects: ["Programming 1", "Data Structures", "Web Development"],
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "seed-2",
    name: "Prof. James Lim",
    department: "Mathematics",
    subjects: ["Calculus I"],
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "seed-3",
    name: "Dr. Ana Reyes",
    department: "English",
    subjects: ["English Composition", "World Literature"],
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "seed-4",
    name: "Prof. Carlo Mendoza",
    department: "Business",
    subjects: ["Business Management"],
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "seed-5",
    name: "Dr. Elena Cruz",
    department: "Nursing",
    subjects: ["Fundamentals of Nursing", "Clinical Practice"],
    createdAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "seed-6",
    name: "Prof. Mark Villanueva",
    department: "Engineering",
    subjects: ["Engineering Mechanics"],
    createdAt: "2026-01-10T00:00:00.000Z",
  },
];

const defaultFacultyById = new Map(
  defaultFaculty.map((member) => [member.id, member]),
);

function normalizeFaculty(records: unknown[]): Faculty[] {
  return records.map((record) => {
    const member = record as Partial<Faculty>;
    const fallback = member.id ? defaultFacultyById.get(member.id) : undefined;
    const subjects =
      Array.isArray(member.subjects) && member.subjects.length > 0
        ? member.subjects
        : fallback?.subjects ?? [member.department ?? "General Subject"];

    return {
      id: member.id ?? crypto.randomUUID(),
      name: member.name ?? "Unknown Faculty",
      department: member.department ?? "Unassigned",
      subjects,
      createdAt: member.createdAt ?? new Date().toISOString(),
    };
  });
}

function readFaculty(): Faculty[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    writeFaculty(defaultFaculty);
    return defaultFaculty;
  }

  try {
    const parsed = JSON.parse(raw) as unknown[];
    const normalized = normalizeFaculty(parsed);
    writeFaculty(normalized);
    return normalized;
  } catch {
    return [];
  }
}

function writeFaculty(faculty: Faculty[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(faculty));
}

export function getFaculty(): Faculty[] {
  return readFaculty().sort((a, b) => a.name.localeCompare(b.name));
}

export function getFacultyByDepartment(department: string): Faculty[] {
  const normalized = department.trim().toLowerCase();

  return getFaculty().filter(
    (member) => member.department.trim().toLowerCase() === normalized,
  );
}

export function addFaculty(input: NewFaculty): Faculty {
  const faculty: Faculty = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    department: input.department.trim(),
    subjects: input.subjects,
    createdAt: new Date().toISOString(),
  };

  writeFaculty([...readFaculty(), faculty]);
  return faculty;
}

export function formatFacultyDate(date: string) {
  const parsed = new Date(date);

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function parseSubjectsInput(value: string): string[] {
  return value
    .split(",")
    .map((subject) => subject.trim())
    .filter(Boolean);
}
