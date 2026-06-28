import { cookies } from 'next/headers';
import { NewCyClient } from '../../../../../../components/admin/forms/NewCyClient';
import { adminApi } from '../../../../../../lib/admin-api';

export default async function NewCyPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  let programs: Awaited<ReturnType<typeof adminApi.programs.list>>['data'] = [];
  try {
    const result = await adminApi.programs.list(token);
    programs = result.data;
  } catch {
    // proceed with empty list
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">New Catalog Year</h1>
      <NewCyClient programs={programs} />
    </div>
  );
}
