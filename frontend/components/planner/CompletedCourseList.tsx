'use client';

import { useMemo, useState } from 'react';
import type { Course } from '../../lib/api';

interface Props {
  courses: Course[];
  completedIds: string[];
  onToggle: (courseId: string) => void;
}

/**
 * `/courses` serialises credit hours as a decimal string ("3.0") while the
 * planner's evaluated courses return a number, so normalise here — otherwise
 * the two columns of the planner disagree about how to write "3 cr".
 */
const formatCredits = (value: string) => {
  const n = Number(value);
  return Number.isFinite(n) ? `${n}` : value;
};

/**
 * The catalog as a single clickable checklist, ordered by course code.
 *
 * The list was previously grouped into collapsible subject sections. Now that
 * the degree selector narrows it, the sections mostly held one subject each and
 * cost a click to open — a flat list is quicker to scan and the filter box does
 * the narrowing.
 */
export function CompletedCourseList({ courses, completedIds, onToggle }: Props) {
  const [query, setQuery] = useState('');

  const completed = useMemo(() => new Set(completedIds), [completedIds]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (
      [...courses]
        .filter(
          (c) =>
            q === '' || c.courseCode.toLowerCase().includes(q) || c.title.toLowerCase().includes(q),
        )
        // Marked courses float to the top: they are the answer the user has built,
        // and hunting for them among a hundred unmarked rows to correct a mistake
        // was the one thing this list made hard.
        .sort((a, b) => {
          const marked = Number(completed.has(b.id)) - Number(completed.has(a.id));
          return marked !== 0 ? marked : a.courseCode.localeCompare(b.courseCode);
        })
    );
  }, [courses, query, completed]);

  const markedCount = visible.filter((c) => completed.has(c.id)).length;

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter courses…"
        aria-label="Filter courses by code or title"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sfbu-navy focus:outline-none focus:ring-1 focus:ring-sfbu-navy"
      />

      <p className="sr-only" role="status">
        {visible.length} course{visible.length !== 1 ? 's' : ''} shown
      </p>

      {visible.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">
          No courses match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <ul className="mt-3 max-h-[26rem] space-y-0.5 overflow-y-auto pr-1">
          {visible.map((course, index) => {
            const isMarked = completed.has(course.id);
            // A rule under the last marked course, so the reordering reads as
            // two groups rather than an arbitrary sort.
            const firstUnmarked = !isMarked && index === markedCount && markedCount > 0;
            return (
              <li key={course.id} className={firstUnmarked ? 'border-t border-gray-200 pt-1' : ''}>
                <label
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-sm transition-colors ${
                    isMarked
                      ? 'border-green-200 bg-green-50'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isMarked}
                    onChange={() => onToggle(course.id)}
                    className="h-4 w-4 shrink-0 rounded border-gray-300 text-sfbu-navy focus:ring-sfbu-navy"
                  />
                  <span
                    className={`w-[4.5rem] shrink-0 rounded px-1.5 py-0.5 text-center font-mono text-xs font-bold ${
                      isMarked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {course.courseCode}
                  </span>
                  <span className={`truncate ${isMarked ? 'text-green-900' : 'text-gray-700'}`}>
                    {course.title}
                  </span>
                  <span className="ml-auto shrink-0 text-xs text-gray-400">
                    {formatCredits(course.creditHours)} cr
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
