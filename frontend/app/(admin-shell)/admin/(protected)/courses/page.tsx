import { cookies } from 'next/headers';
import Link from 'next/link';
import { adminApi } from '../../../../../lib/admin-api';
import { AdminCoursesTable } from '../../../../../components/admin/tables/AdminCoursesTable';

export const metadata = { title: 'Courses' };

interface Props {
  searchParams: Promise<{ page?: string; q?: string; level?: string }>;
}

export default async function AdminCoursesPage({ searchParams }: Props) {
  const { page: pageStr, q, level } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  let result: Awaited<ReturnType<typeof adminApi.courses.list>>;
  try {
    result = await adminApi.courses.list(token, page, q, level);
  } catch {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Courses</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load courses</p>
          <p className="text-red-500 text-sm">
            The API may be temporarily unavailable. Please refresh.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <Link
          href="/admin/courses/new"
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          + New Course
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <AdminCoursesTable
          rows={result.data}
          total={result.total}
          page={page}
          limit={result.limit}
        />
      </div>
    </div>
  );
}
