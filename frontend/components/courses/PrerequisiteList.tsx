import Link from 'next/link';
import type { CoursePrerequisiteItem } from '../../lib/api';

interface Props {
  prerequisites: CoursePrerequisiteItem[];
  corequisites: CoursePrerequisiteItem[];
}

function CourseChip({ course }: { course: CoursePrerequisiteItem }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:border-sfbu-navy/40 hover:bg-[#f0f4fa] transition-colors"
    >
      <span className="font-mono font-semibold text-gray-800">{course.courseCode}</span>
      <span className="text-gray-500">{course.title}</span>
      <span className="text-xs text-gray-400">{course.creditHours} cr</span>
    </Link>
  );
}

export function PrerequisiteList({ prerequisites, corequisites }: Props) {
  if (prerequisites.length === 0 && corequisites.length === 0) {
    return (
      <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-200 px-5 py-4">
        No prerequisites or corequisites required.
      </p>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
      {prerequisites.length > 0 && (
        <div className="px-5 py-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Prerequisites
          </h3>
          <div className="flex flex-wrap gap-2">
            {prerequisites.map((c) => (
              <CourseChip key={c.id} course={c} />
            ))}
          </div>
        </div>
      )}
      {corequisites.length > 0 && (
        <div className="px-5 py-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Corequisites
          </h3>
          <div className="flex flex-wrap gap-2">
            {corequisites.map((c) => (
              <CourseChip key={c.id} course={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
