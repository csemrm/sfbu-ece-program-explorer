'use client';

import Link from 'next/link';
import type { PlannerCourseRef } from '../../lib/api';

interface Props {
  suggestions: PlannerCourseRef[];
  /** Add a suggested course to the last term. */
  onAdd: (courseId: string) => void;
}

/** Courses the user can take next, unlocked once the whole plan is complete. */
export function SuggestionsPanel({ suggestions, onAdd }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-800">Suggested next courses</h2>
      <p className="mb-3 text-xs text-gray-400">
        Unlocked once your plan is complete — every prerequisite would be satisfied.
      </p>

      {suggestions.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">
          No newly unlocked courses yet. Add completed courses or fill in a semester.
        </p>
      ) : (
        <ul className="space-y-2">
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-2.5 rounded-lg border border-gray-100 px-2.5 py-2"
            >
              <Link
                href={`/courses/${s.id}`}
                className="w-24 shrink-0 rounded bg-gray-100 px-2 py-0.5 text-center font-mono text-xs font-bold text-gray-700 hover:bg-gray-200"
              >
                {s.courseCode}
              </Link>
              <span className="min-w-0 flex-1 truncate text-sm text-gray-700">{s.title}</span>
              <button
                type="button"
                onClick={() => onAdd(s.id)}
                className="shrink-0 rounded-lg border border-sfbu-navy px-2 py-1 text-xs font-medium text-sfbu-navy hover:bg-sfbu-navy hover:text-white"
              >
                + Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
