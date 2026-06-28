import Link from 'next/link';
import type { RoadmapCourse } from '../../lib/api';

interface Props {
  course: RoadmapCourse;
}

const levelBorder: Record<string, string> = {
  undergraduate: 'border-l-blue-400',
  graduate: 'border-l-purple-400',
};

export function RoadmapCourseCard({ course }: Props) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className={`block rounded-lg border border-gray-200 border-l-4 ${levelBorder[course.level] ?? 'border-l-gray-300'} bg-white p-3 hover:shadow-md hover:border-gray-300 transition-all`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-mono text-xs font-bold text-gray-700">{course.courseCode}</span>
        <span className="text-xs text-gray-400 flex-shrink-0">{course.creditHours} cr</span>
      </div>
      <p className="text-xs font-medium text-gray-800 leading-snug line-clamp-2">{course.title}</p>
    </Link>
  );
}
