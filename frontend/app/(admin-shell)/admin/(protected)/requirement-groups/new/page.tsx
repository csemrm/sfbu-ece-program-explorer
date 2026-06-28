import { cookies } from 'next/headers';
import { NewRgClient } from '../../../../../../components/admin/forms/NewRgClient';
import { adminApi } from '../../../../../../lib/admin-api';

export default async function NewRgPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  let catalogYears: Awaited<ReturnType<typeof adminApi.catalogYears.list>> = [];
  try {
    catalogYears = await adminApi.catalogYears.list(token);
  } catch {
    // proceed with empty list — form will show no options
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        New Requirement Group
      </h1>
      <NewRgClient catalogYears={catalogYears} />
    </div>
  );
}
