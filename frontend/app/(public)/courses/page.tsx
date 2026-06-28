import { Suspense } from 'react';
import type { Metadata } from 'next';
import { api } from '../../../lib/api';
import { CourseCard } from '../../../components/courses/CourseCard';
import { CourseFilters } from '../../../components/courses/CourseFilters';
import { CoursePagination } from '../../../components/courses/CoursePagination';
import { Breadcrumb } from '../../../components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Browse all courses in the SFBU ECE catalog.',
};

interface Props {
  searchParams: Promise<{ q?: string; level?: string; page?: string }>;
}

export default async function CoursesPage({ searchParams }: Props) {
  const { q, level, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1);
  const limit = 18;

  let result: Awaited<ReturnType<typeof api.courses.list>>;
  try {
    result = await api.courses.list({
      ...(q ? { q } : {}),
      ...(level ? { level } : {}),
      page,
      limit,
    });
  } catch {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load courses</p>
          <p className="text-red-500 text-sm">
            The server may be temporarily unavailable. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const rawParams: Record<string, string> = {};
  if (q) rawParams.q = q;
  if (level) rawParams.level = level;

  return (
    <div>
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-7">
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Courses' }]} />
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'var(--sfbu-gold)' }}
          >
            ECE Department
          </p>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
              <p className="text-gray-500 mt-1.5 text-base">
                {result.total} course{result.total !== 1 ? 's' : ''} across all programs.
              </p>
            </div>
            {(q || level) && (
              <span className="hidden sm:block text-sm text-gray-400 pb-1">Filtered results</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <Suspense fallback={<div className="h-10 bg-gray-100 rounded-lg animate-pulse" />}>
            <CourseFilters />
          </Suspense>
        </div>

        {result.data.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-lg mb-2">No courses found.</p>
            {(q || level) && (
              <p className="text-gray-400 text-sm">Try a different search or clear the filters.</p>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.data.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <CoursePagination
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
              searchParams={rawParams}
            />
          </>
        )}
      </div>
    </div>
  );
}
