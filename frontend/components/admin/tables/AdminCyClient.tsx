'use client';

import { DataTable } from '../DataTable';
import type { AdminCatalogYear } from '../../../lib/admin-api';

const columns = [
  { key: 'academicYear', header: 'Academic Year' },
  {
    key: 'programId',
    header: 'Program ID',
    render: (row: AdminCatalogYear) => (
      <span className="font-mono text-xs text-gray-500">{row.programId.slice(0, 8)}…</span>
    ),
  },
  {
    key: 'effectiveDate',
    header: 'Effective Date',
    render: (row: AdminCatalogYear) => <span>{row.effectiveDate ?? '—'}</span>,
  },
  {
    key: 'createdAt',
    header: 'Created',
    render: (row: AdminCatalogYear) => <span>{new Date(row.createdAt).toLocaleDateString()}</span>,
  },
];

export function AdminCyClient({ rows }: { rows: AdminCatalogYear[] }) {
  return <DataTable columns={columns} rows={rows} />;
}
