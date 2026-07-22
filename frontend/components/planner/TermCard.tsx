'use client';

import type { Course, EvaluatedTerm } from '../../lib/api';
import { CoursePicker } from './CoursePicker';
import { CourseVerdictRow } from './CourseVerdictRow';

interface Props {
  index: number; // 0-based
  courseIds: string[];
  courses: Course[];
  evaluation?: EvaluatedTerm;
  onAddCourse: (courseId: string) => void;
  onRemoveCourse: (courseId: string) => void;
  onRemoveTerm: () => void;
}

/** A single planned semester: a course picker plus per-course verdicts. */
export function TermCard({
  index,
  courseIds,
  courses,
  evaluation,
  onAddCourse,
  onRemoveCourse,
  onRemoveTerm,
}: Props) {
  const exclude = new Set(courseIds);
  const byId = new Map(courses.map((c) => [c.id, c]));
  const blocked = evaluation?.courses.filter((c) => !c.eligible).length ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: 'var(--sfbu-navy)' }}
          >
            {index + 1}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Semester {index + 1}</h3>
            <p className="text-xs text-gray-400">
              {courseIds.length} course{courseIds.length !== 1 ? 's' : ''}
              {evaluation ? ` · ${evaluation.termCredits} cr` : ''}
              {blocked > 0 ? ` · ${blocked} blocked` : ''}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemoveTerm}
          className="rounded-lg px-2 py-1 text-xs text-gray-400 hover:bg-gray-50 hover:text-red-500"
        >
          Remove
        </button>
      </div>

      <div className="space-y-3 px-4 py-3">
        <CoursePicker
          courses={courses}
          excludeIds={exclude}
          onSelect={onAddCourse}
          placeholder="Add a course to this semester…"
        />

        {courseIds.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">
            No courses yet. Search above to add one.
          </p>
        ) : (
          <ul className="space-y-2">
            {courseIds.map((id) => {
              const verdict = evaluation?.courses.find((c) => c.courseId === id);
              if (verdict) {
                return (
                  <CourseVerdictRow key={id} course={verdict} onRemove={() => onRemoveCourse(id)} />
                );
              }
              const c = byId.get(id);
              return (
                <li
                  key={id}
                  className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2.5 text-sm text-gray-400"
                >
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-bold text-gray-500">
                    {c?.courseCode ?? '…'}
                  </span>
                  <span className="truncate">checking eligibility…</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
