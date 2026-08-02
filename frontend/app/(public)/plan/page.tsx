import type { Metadata } from 'next';
import { api, type Course, type TermSummary } from '../../../lib/api';
import { Breadcrumb } from '../../../components/ui/Breadcrumb';
import { OfferingPlanner } from '../../../components/planner/OfferingPlanner';

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

/**
 * Academic terms are optional context: if none are curated (or the endpoint
 * fails) the planner still works, it just skips the availability check rather
 * than taking the whole page down with it.
 */
async function loadTerms(): Promise<TermSummary[]> {
  try {
    return await api.terms.list();
  } catch {
    return [];
  }
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

  const academicTerms = await loadTerms();

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
            Mark the courses you&apos;ve completed on the left, then pick from what&apos;s actually
            offered next semester on the right. Anything with prerequisites you haven&apos;t met yet
            is highlighted, with the missing courses named. Nothing is saved to any server — your
            plan lives only in this browser.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <OfferingPlanner courses={courses} academicTerms={academicTerms} />
      </div>
    </div>
  );
}
