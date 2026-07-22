import type { Metadata } from 'next';
import { api, type Course } from '../../../lib/api';
import { Breadcrumb } from '../../../components/ui/Breadcrumb';
import { SemesterPlanner } from '../../../components/planner/SemesterPlanner';

export const metadata: Metadata = {
  title: 'Semester Planner',
  description:
    'Plan your semesters, mark completed courses, and check prerequisite eligibility before you register.',
};

async function loadAllCourses(): Promise<Course[]> {
  const limit = 100;
  const first = await api.courses.list({ page: 1, limit });
  const courses = [...first.data];
  for (let page = 2; page <= first.totalPages; page++) {
    const next = await api.courses.list({ page, limit });
    courses.push(...next.data);
  }
  return courses;
}

export default async function PlanPage() {
  let courses: Course[];
  try {
    courses = await loadAllCourses();
  } catch {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load courses</p>
          <p className="text-red-500 text-sm">
            The planner needs the course catalog. The server may be temporarily unavailable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-7">
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Semester Planner' }]} />
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'var(--sfbu-gold)' }}
          >
            ECE Department
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Semester Planner</h1>
          <p className="text-gray-500 mt-1.5 text-base max-w-2xl">
            Mark the courses you&apos;ve completed, then build out your upcoming semesters. The
            planner checks prerequisites and corequisites for every course and explains what&apos;s
            blocking you. Nothing is saved to any server — your plan lives only in this browser.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <SemesterPlanner courses={courses} />
      </div>
    </div>
  );
}
