import Link from 'next/link';
import type { Course } from '../../lib/api';

interface Props {
  course: Course;
}

const levelColors = {
  undergraduate: 'bg-blue-50 text-blue-700 border-blue-200',
  graduate: 'bg-purple-50 text-purple-700 border-purple-200',
};

export function CourseCard({ course }: Props) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="font-mono font-bold text-gray-900 text-sm bg-gray-100 rounded px-2 py-1">
          {course.courseCode}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-xs font-medium border rounded-full px-2 py-0.5 ${levelColors[course.level]}`}
          >
            {course.level === 'undergraduate' ? 'UG' : 'Grad'}
          </span>
          <span className="text-xs text-gray-500 font-medium">{course.creditHours} cr</span>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 group-hover:text-blue-700 transition-colors">
        {course.title}
      </h3>

      {course.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{course.description}</p>
      )}
    </Link>
  );
}
