'use client';

import type { Course } from '../../lib/api';
import { CompletedCourseList } from './CompletedCourseList';

interface Props {
  /** Courses to list — already narrowed to the chosen degree. */
  courses: Course[];
  /**
   * The unscoped catalog, used only to resolve the chips. A course completed
   * under one degree stays marked when the user switches to another, so its
   * code must still resolve even though it is absent from `courses`.
   */
  allCourses?: Course[];
  /** Abbreviation of the selected degree, shown when a filter matches nothing. */
  degreeLabel?: string | null;
  completedIds: string[];
  onAdd: (courseId: string) => void;
  onRemove: (courseId: string) => void;
  onClear: () => void;
}

/** Panel for marking courses the user has already completed. */
export function CompletedPanel({
  courses,
  allCourses,
  degreeLabel,
  completedIds,
  onAdd,
  onRemove,
  onClear,
}: Props) {
  const byId = new Map((allCourses ?? courses).map((c) => [c.id, c]));
  const marked = new Set(completedIds);

  const toggle = (courseId: string) =>
    marked.has(courseId) ? onRemove(courseId) : onAdd(courseId);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Completed courses</h2>
          <p className="text-xs text-gray-400">
            {completedIds.length} of {courses.length} marked — these satisfy prerequisites in your
            plan.
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

      <CompletedCourseList
        courses={courses}
        allCourses={allCourses}
        degreeLabel={degreeLabel}
        completedIds={completedIds}
        onToggle={toggle}
      />

      {completedIds.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
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
