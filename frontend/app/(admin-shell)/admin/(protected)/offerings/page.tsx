import { cookies } from 'next/headers';
import { adminApi, type AdminTerm } from '../../../../../lib/admin-api';
import { api, type Course } from '../../../../../lib/api';
import { OfferingsManager } from '../../../../../components/admin/OfferingsManager';

export const metadata = { title: 'Course Offerings' };

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

export default async function AdminOfferingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';

  let terms: AdminTerm[];
  let courses: Course[];
  try {
    [terms, courses] = await Promise.all([adminApi.offerings.terms(token), loadAllCourses()]);
  } catch {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Offerings</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load offerings</p>
          <p className="text-red-500 text-sm">
            The API may be temporarily unavailable. Please refresh.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Offerings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-3xl">
          Curate which courses are offered each term. Pick a &ldquo;this semester&rdquo; and
          &ldquo;next semester&rdquo; term, then check next-semester courses to see whether a
          student who takes this semester&rsquo;s offerings would be eligible.
        </p>
      </div>

      <OfferingsManager initialTerms={terms} courses={courses} />
    </div>
  );
}
