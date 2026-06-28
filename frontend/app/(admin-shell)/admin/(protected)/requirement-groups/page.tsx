import { cookies } from 'next/headers';
import { adminApi } from '../../../../../lib/admin-api';
import { AdminRgClient } from '../../../../../components/admin/tables/AdminRgClient';

export const metadata = { title: 'Requirement Groups' };

export default async function RequirementGroupsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')!.value;
  const result = await adminApi.requirementGroups.list(token);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Requirement Groups</h1>
      <div className="bg-white rounded-xl border border-gray-200">
        <AdminRgClient rows={result.data} />
      </div>
    </div>
  );
}
