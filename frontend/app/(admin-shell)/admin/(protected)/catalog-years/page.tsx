import { cookies } from 'next/headers';
import { adminApi } from '../../../../../lib/admin-api';
import { AdminCyClient } from '../../../../../components/admin/tables/AdminCyClient';

export const metadata = { title: 'Catalog Years' };

export default async function CatalogYearsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  let years: Awaited<ReturnType<typeof adminApi.catalogYears.list>>;
  try {
    years = await adminApi.catalogYears.list(token);
  } catch {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Catalog Years</h1>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load catalog years</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Catalog Years</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <AdminCyClient rows={years} />
      </div>
    </div>
  );
}
