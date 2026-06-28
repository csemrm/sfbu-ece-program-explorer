import { cookies } from 'next/headers';
import Link from 'next/link';
import { adminApi } from '../../../../../lib/admin-api';
import { AdminProgramsTable } from '../../../../../components/admin/tables/AdminProgramsTable';

export const metadata = { title: 'Programs' };

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminProgramsPage({ searchParams }: Props) {
  const { page: pageStr, q } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  let result: Awaited<ReturnType<typeof adminApi.programs.list>>;
  try {
    result = await adminApi.programs.list(token, page, q);
  } catch {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Programs</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load programs</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
        <Link
          href="/admin/programs/new"
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          + New Program
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <AdminProgramsTable
          rows={result.data}
          total={result.total}
          page={page}
          limit={result.limit}
        />
      </div>
    </div>
  );
}
