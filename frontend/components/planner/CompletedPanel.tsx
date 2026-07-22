'use client';

import type { Course } from '../../lib/api';
import { CoursePicker } from './CoursePicker';

interface Props {
  courses: Course[];
  completedIds: string[];
  onAdd: (courseId: string) => void;
  onRemove: (courseId: string) => void;
  onClear: () => void;
}

/** Panel for marking courses the user has already completed. */
export function CompletedPanel({ courses, completedIds, onAdd, onRemove, onClear }: Props) {
  const byId = new Map(courses.map((c) => [c.id, c]));
  const exclude = new Set(completedIds);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Completed courses</h2>
          <p className="text-xs text-gray-400">
            {completedIds.length} marked — these satisfy prerequisites in your plan.
          </p>
        </div>
        {completedIds.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-2 py-1 text-xs text-gray-400 hover:bg-gray-50 hover:text-red-500"
          >
            Clear all
          </button>
        )}
      </div>

      <CoursePicker
        courses={courses}
        excludeIds={exclude}
        onSelect={onAdd}
        placeholder="Mark a completed course…"
      />

      {completedIds.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {completedIds.map((id) => {
            const c = byId.get(id);
            if (!c) return null;
            return (
              <li key={id}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 py-1 pl-2.5 pr-1.5 text-xs font-medium text-green-800">
                  <span className="font-mono font-bold">{c.courseCode}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(id)}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-green-600 hover:bg-green-200"
                    aria-label={`Unmark ${c.courseCode}`}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 2l6 6M8 2l-6 6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
