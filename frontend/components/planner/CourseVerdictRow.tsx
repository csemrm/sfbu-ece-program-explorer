'use client';

import type { EvaluatedCourse } from '../../lib/api';

interface Props {
  course: EvaluatedCourse;
  onRemove: () => void;
}

/** One course inside a term: code, title, eligibility badge, and explanation. */
export function CourseVerdictRow({ course, onRemove }: Props) {
  const ok = course.eligible;
  return (
    <li
      className={`rounded-lg border px-3 py-2.5 ${
        ok ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
            ok ? 'bg-green-600' : 'bg-red-500'
          }`}
          aria-hidden
        >
          {ok ? '✓' : '!'}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-bold text-gray-700">
              {course.courseCode}
            </span>
            <span className="truncate text-sm font-medium text-gray-800">{course.title}</span>
            <span className="ml-auto shrink-0 text-xs text-gray-400">{course.creditHours} cr</span>
          </div>

          <p className={`mt-1 text-xs ${ok ? 'text-green-700' : 'text-red-600'}`}>
            <span className="sr-only">{ok ? 'Eligible: ' : 'Not eligible: '}</span>
            {course.reason}
          </p>

          {course.alreadyCompleted && (
            <p className="mt-1 text-xs text-amber-600">
              You already marked this course as completed.
            </p>
          )}

          {course.corequisites.length > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              Corequisites:{' '}
              {course.corequisites.map((c, i) => (
                <span key={c.id}>
                  {i > 0 && ', '}
                  <span
                    className={c.status === 'unmet' ? 'font-medium text-red-600' : 'text-gray-600'}
                  >
                    {c.courseCode}
                    {c.status === 'same-term' && ' (this term)'}
                    {c.status === 'completed' && ' (done)'}
                    {c.status === 'unmet' && ' (not scheduled)'}
                  </span>
                </span>
              ))}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded p-1 text-gray-400 hover:bg-white hover:text-red-500"
          aria-label={`Remove ${course.courseCode} from this term`}
          title="Remove"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 3l8 8M11 3l-8 8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}
