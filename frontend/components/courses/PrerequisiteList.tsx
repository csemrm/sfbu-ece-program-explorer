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
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:border-blue-300 hover:bg-blue-50 transition-colors"
    >
      <span className="font-mono font-semibold text-gray-800">{course.courseCode}</span>
      <span className="text-gray-500">{course.title}</span>
      <span className="text-xs text-gray-400">{course.creditHours} cr</span>
    </Link>
  );
}

export function PrerequisiteList({ prerequisites, corequisites }: Props) {
  if (prerequisites.length === 0 && corequisites.length === 0) {
    return <p className="text-sm text-gray-400">No prerequisites or corequisites required.</p>;
  }

  return (
    <div className="space-y-4">
      {prerequisites.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites</h3>
          <div className="flex flex-wrap gap-2">
            {prerequisites.map((c) => (
              <CourseChip key={c.id} course={c} />
            ))}
          </div>
        </div>
      )}
      {corequisites.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Corequisites</h3>
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
