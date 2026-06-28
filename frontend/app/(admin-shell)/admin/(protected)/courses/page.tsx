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
  const token = cookieStore.get('admin_token')!.value;
  const result = await adminApi.courses.list(token, page, q, level);

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
