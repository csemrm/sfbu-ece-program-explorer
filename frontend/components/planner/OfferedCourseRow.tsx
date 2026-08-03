'use client';

import type { EvaluatedCourse } from '../../lib/api';

interface Props {
  course: EvaluatedCourse;
  selected: boolean;
  onToggle: () => void;
  /** Corequisite codes that are offered but not currently selected. */
  unselectedCorequisites: string[];
  /** Credits still short of the degree total; set only for a capstone taken too early. */
  capstoneShortfall?: number | null;
}

/**
 * One course in the "next semester" column: a checkbox, the course, and — when
 * prerequisites are unmet — a highlighted explanation of what is missing.
 *
 * A blocked course is still selectable. The planner is advisory, not a
 * registration gate, and a student may well be resolving the prerequisite by
 * other means (transfer credit, waiver, a course taken elsewhere). Blocking the
 * checkbox would assert an authority this tool does not have.
 */
export function OfferedCourseRow({
  course,
  selected,
  onToggle,
  unselectedCorequisites,
  capstoneShortfall = null,
}: Props) {
  const blocked = !course.eligible;
  // A course that runs but is closed to registration is a different problem
  // from an unmet prerequisite: the student is ready, the registrar is not.
  const closed = course.openForRegistration === false;
  const cancelled = closed && /cancel/i.test(course.statusNote ?? '');
  const reasonId = `offered-${course.courseId}-reason`;

  /**
   * A course cannot be added while it is blocked or closed — but it can always
   * be removed.
   *
   * Gating only the "add" direction means a course that becomes blocked after
   * it was chosen (the student unmarks its prerequisite, the registrar cancels
   * a section) is never stranded in the plan with no way to take it out.
   *
   * A student holding a waiver or transfer credit for the prerequisite marks
   * that prerequisite as completed on the left, which unblocks this row — so
   * gating here does not shut them out.
   */
  const cannotAdd = (blocked || closed) && !selected;

  return (
    <li
      className={`rounded-lg border transition-colors ${
        blocked
          ? 'border-red-200 bg-red-50/60'
          : closed
            ? 'border-amber-200 bg-amber-50/50'
            : selected
              ? 'border-sfbu-navy bg-blue-50/40'
              : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <label
        className={`flex items-start gap-3 px-3 py-2.5 ${
          cannotAdd ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <input
          type="checkbox"
          checked={selected}
          // Guarded as well as disabled: the attribute stops a real user, this
          // stops any other path to the handler.
          // Guarded as well as disabled: the attribute stops a real user, this
          // stops any other path to the handler.
          onChange={() => {
            if (!cannotAdd) onToggle();
          }}
          disabled={cannotAdd}
          aria-describedby={blocked || closed ? reasonId : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-sfbu-navy focus:ring-sfbu-navy disabled:cursor-not-allowed disabled:opacity-50"
        />

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-bold text-gray-700">
              {course.courseCode}
            </span>
            <span className="truncate text-sm font-medium text-gray-800">{course.title}</span>
            {blocked && (
              <span className="shrink-0 rounded bg-red-100 px-1.5 py-0.5 text-[11px] font-semibold text-red-800">
                Prerequisites pending
              </span>
            )}
            {capstoneShortfall !== null && !closed && (
              <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800">
                Final semester
              </span>
            )}
            {closed && (
              <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800">
                {cancelled ? 'Cancelled' : 'Registration closed'}
              </span>
            )}
            <span className="ml-auto shrink-0 text-xs text-gray-400">
              {course.sectionCount !== null && course.sectionCount > 1 && (
                <span className="mr-1.5">{course.sectionCount} sections</span>
              )}
              {course.creditHours} cr
            </span>
          </span>

          {blocked && (
            <span id={reasonId} className="mt-1 block text-xs text-red-700">
              <span className="sr-only">Prerequisites pending: </span>
              Needs{' '}
              {course.missingPrerequisites.map((p, i) => (
                <span key={p.id}>
                  {i > 0 && ', '}
                  <span className="font-mono font-semibold">{p.courseCode}</span>
                </span>
              ))}
              {course.corequisites.some((c) => c.status === 'unmet') && (
                <>
                  {course.missingPrerequisites.length > 0 && '; '}
                  corequisite{' '}
                  {course.corequisites
                    .filter((c) => c.status === 'unmet')
                    .map((c) => c.courseCode)
                    .join(', ')}{' '}
                  not scheduled
                </>
              )}
            </span>
          )}

          {/* The registrar's own wording explains this better than a category
              we could invent, so it is shown verbatim when there is one. */}
          {closed && !blocked && (
            <span id={reasonId} className="mt-1 block text-xs text-amber-700">
              <span className="sr-only">{cancelled ? 'Cancelled: ' : 'Registration closed: '}</span>
              {course.statusNote ?? 'Not open for registration this term.'}
            </span>
          )}

          {capstoneShortfall !== null && !closed && (
            <span className="mt-1 block text-xs text-amber-700">
              <span className="sr-only">Final semester only: </span>
              The capstone is taken in your final semester — {capstoneShortfall} more credits needed
              first.
            </span>
          )}

          {/* Selecting a course without its corequisite is a real mistake, but
              only worth flagging once the user has actually picked it. */}
          {!blocked && selected && unselectedCorequisites.length > 0 && (
            <span className="mt-1 block text-xs text-amber-700">
              Also select {unselectedCorequisites.join(', ')} — required alongside this course.
            </span>
          )}

          {course.alreadyCompleted && (
            <span className="mt-1 block text-xs text-amber-600">
              You already marked this course as completed.
            </span>
          )}
        </span>
      </label>
    </li>
  );
}
