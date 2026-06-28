import { cookies } from 'next/headers';
import { adminApi } from '../../../../../lib/admin-api';
import { AdminKaClient } from '../../../../../components/admin/tables/AdminKaClient';

export const metadata = { title: 'Knowledge Areas' };

export default async function KnowledgeAreasPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')!.value;
  const areas = await adminApi.knowledgeAreas.list(token);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Knowledge Areas</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        <AdminKaClient rows={areas} />
      </div>
    </div>
  );
}
