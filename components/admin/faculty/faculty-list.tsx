"use client";

import { useEffect, useState } from "react";

import { formatFacultyDate, getFaculty } from "@/lib/faculty/storage";
import type { Faculty } from "@/lib/types/faculty";

interface FacultyListProps {
  refreshKey: number;
}

export function FacultyList({ refreshKey }: FacultyListProps) {
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  useEffect(() => {
    setFaculty(getFaculty());
  }, [refreshKey]);

  if (faculty.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-600">No faculty yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Add a faculty member using the button above.
        </p>
      </div>
    );
  }

  return (
    <section className="flex max-h-[28rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Faculty list</h2>
        <p className="mt-1 text-sm text-slate-500">
          {faculty.length} faculty member{faculty.length === 1 ? "" : "s"} on
          record.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Department</th>
              <th className="px-6 py-3 font-medium">Subjects</th>
              <th className="px-6 py-3 font-medium">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {faculty.map((member) => (
              <tr key={member.id} className="text-slate-700">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {member.name}
                </td>
                <td className="px-6 py-4">{member.department}</td>
                <td className="px-6 py-4">{member.subjects.join(", ")}</td>
                <td className="px-6 py-4">
                  {formatFacultyDate(member.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
