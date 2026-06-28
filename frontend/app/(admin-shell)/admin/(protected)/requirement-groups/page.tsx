import { cookies } from 'next/headers';
import Link from 'next/link';
import { adminApi } from '../../../../../lib/admin-api';
import { AdminRgClient } from '../../../../../components/admin/tables/AdminRgClient';

export const metadata = { title: 'Requirement Groups' };

export default async function RequirementGroupsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  let result: Awaited<ReturnType<typeof adminApi.requirementGroups.list>>;
  let catalogYears: Awaited<ReturnType<typeof adminApi.catalogYears.list>> = [];
  try {
    [result, catalogYears] = await Promise.all([
      adminApi.requirementGroups.list(token),
      adminApi.catalogYears.list(token),
    ]);
  } catch {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Requirement Groups</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load requirement groups</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Requirement Groups</h1>
        <Link
          href="/admin/requirement-groups/new"
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          + New Requirement Group
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <AdminRgClient rows={result.data} catalogYears={catalogYears} />
      </div>
    </div>
  );
}
