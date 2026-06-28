import { cookies } from 'next/headers';
import { adminApi } from '../../../../../lib/admin-api';
import { AdminKaClient } from '../../../../../components/admin/tables/AdminKaClient';

export const metadata = { title: 'Knowledge Areas' };

export default async function KnowledgeAreasPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  let areas: Awaited<ReturnType<typeof adminApi.knowledgeAreas.list>>;
  try {
    areas = await adminApi.knowledgeAreas.list(token);
  } catch {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Knowledge Areas</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load knowledge areas</p>
          <p className="text-red-500 text-sm">
            The API may be temporarily unavailable. Please refresh.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Knowledge Areas</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        <AdminKaClient rows={areas} />
      </div>
    </div>
  );
}
