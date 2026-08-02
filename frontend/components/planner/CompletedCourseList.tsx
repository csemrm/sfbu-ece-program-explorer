'use client';

import { useMemo, useState } from 'react';
import type { Course } from '../../lib/api';

interface Props {
  courses: Course[];
  completedIds: string[];
  onToggle: (courseId: string) => void;
}

/** Readable names for the course-code prefixes present in the catalog. */
const SUBJECT_NAMES: Record<string, string> = {
  CS: 'Computer Science',
  CE: 'Computer Engineering',
  EE: 'Electrical Engineering',
  MATH: 'Mathematics',
  BUS: 'Business',
};

/** Display order. Anything unrecognised sorts after these, alphabetically. */
const SUBJECT_ORDER = ['CS', 'CE', 'EE', 'MATH', 'BUS'];

const subjectOf = (courseCode: string) =>
  courseCode.match(/^[A-Za-z]+/)?.[0].toUpperCase() ?? 'Other';

/**
 * `/courses` serialises credit hours as a decimal string ("3.0") while the
 * planner's evaluated courses return a number, so normalise here — otherwise
 * the two columns of the planner disagree about how to write "3 cr".
 */
const formatCredits = (value: string) => {
  const n = Number(value);
  return Number.isFinite(n) ? `${n}` : value;
};

const rank = (subject: string) => {
  const i = SUBJECT_ORDER.indexOf(subject);
  return i === -1 ? SUBJECT_ORDER.length : i;
};

/**
 * The full catalog as a clickable checklist, grouped by subject.
 *
 * The planner previously offered only a type-ahead, which required knowing a
 * course code before you could mark it. Browsing is the more common need — a
 * student recognises what they have taken far more readily than they recall
 * its code — so the whole catalog is listed and the search box narrows it
 * rather than being the only way in.
 */
export function CompletedCourseList({ courses, completedIds, onToggle }: Props) {
  const [query, setQuery] = useState('');
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const completed = useMemo(() => new Set(completedIds), [completedIds]);
  const filtering = query.trim() !== '';

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const bySubject = new Map<string, Course[]>();

    for (const course of courses) {
      const subject = subjectOf(course.courseCode);
      const bucket = bySubject.get(subject);
      if (bucket) bucket.push(course);
      else bySubject.set(subject, [course]);
    }

    return [...bySubject.entries()]
      .map(([subject, all]) => ({
        subject,
        total: all.length,
        courses: [...all]
          .sort((a, b) => a.courseCode.localeCompare(b.courseCode))
          .filter(
            (c) =>
              q === '' ||
              c.courseCode.toLowerCase().includes(q) ||
              c.title.toLowerCase().includes(q),
          ),
      }))
      .sort((a, b) => rank(a.subject) - rank(b.subject) || a.subject.localeCompare(b.subject));
  }, [courses, query]);

  const visibleCount = groups.reduce((sum, g) => sum + g.courses.length, 0);

  // While filtering every group opens, otherwise a match could sit hidden
  // inside a collapsed section and read as "no results".
  const isOpen = (subject: string, index: number) =>
    filtering || (overrides[subject] ?? index === 0);

  const toggleSubject = (subject: string, index: number) =>
    setOverrides((prev) => ({ ...prev, [subject]: !(prev[subject] ?? index === 0) }));

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
        {visibleCount} course{visibleCount !== 1 ? 's' : ''} shown
      </p>

      {visibleCount === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">
          No courses match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <div className="mt-3 max-h-[26rem] space-y-1 overflow-y-auto pr-1">
          {groups.map((group, index) => {
            const open = isOpen(group.subject, index);
            const markedHere = group.courses.filter((c) => completed.has(c.id)).length;
            const panelId = `subject-panel-${group.subject}`;

            if (group.courses.length === 0) return null;

            return (
              <section key={group.subject}>
                <h3>
                  <button
                    type="button"
                    onClick={() => toggleSubject(group.subject, index)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-gray-50"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      aria-hidden="true"
                      className={`shrink-0 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`}
                    >
                      <path
                        d="M3 1l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-xs font-semibold text-gray-700">
                      {group.subject}
                      <span className="font-normal text-gray-400">
                        {' · '}
                        {SUBJECT_NAMES[group.subject] ?? 'Other'}
                      </span>
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-gray-400">
                      {markedHere > 0 && (
                        <span className="mr-1.5 font-medium text-green-700">{markedHere} ✓</span>
                      )}
                      {group.courses.length}
                      {filtering && group.courses.length !== group.total && ` of ${group.total}`}
                    </span>
                  </button>
                </h3>

                {open && (
                  <ul id={panelId} className="mb-1 space-y-0.5">
                    {group.courses.map((course) => {
                      const isMarked = completed.has(course.id);
                      return (
                        <li key={course.id}>
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
                                isMarked
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {course.courseCode}
                            </span>
                            <span
                              className={`truncate ${isMarked ? 'text-green-900' : 'text-gray-700'}`}
                            >
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
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
