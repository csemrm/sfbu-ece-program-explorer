import { cookies } from 'next/headers';
import { adminApi } from '../../../../../lib/admin-api';
import { DataTable } from '../../../../../components/admin/DataTable';

export const metadata = { title: 'Catalog Years' };

export default async function CatalogYearsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')!.value;
  const years = await adminApi.catalogYears.list(token);

  const columns = [
    { key: 'academicYear', header: 'Academic Year' },
    {
      key: 'programId',
      header: 'Program ID',
      render: (row: (typeof years)[0]) => (
        <span className="font-mono text-xs text-gray-500">{row.programId.slice(0, 8)}…</span>
      ),
    },
    {
      key: 'effectiveDate',
      header: 'Effective Date',
      render: (row: (typeof years)[0]) => <span>{row.effectiveDate ?? '—'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row: (typeof years)[0]) => (
        <span>{new Date(row.createdAt).toLocaleDateString()}</span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Catalog Years</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable columns={columns} rows={years} />
      </div>
    </div>
  );
}
