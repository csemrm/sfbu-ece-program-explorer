'use client';

import { DataTable } from '../DataTable';
import type { AdminCatalogYear, AdminProgram } from '../../../lib/admin-api';

interface Props {
  rows: AdminCatalogYear[];
  programs: Pick<AdminProgram, 'id' | 'abbreviation' | 'name'>[];
}

export function AdminCyClient({ rows, programs }: Props) {
  const programMap = new Map(programs.map((p) => [p.id, p]));

  const columns = [
    { key: 'academicYear', header: 'Academic Year' },
    {
      key: 'programId',
      header: 'Program',
      render: (row: AdminCatalogYear) => {
        const p = programMap.get(row.programId);
        return p ? (
          <span className="font-medium text-gray-800">
            {p.abbreviation}
            <span className="ml-1.5 text-xs text-gray-400 font-normal">{p.name}</span>
          </span>
        ) : (
          <span className="font-mono text-xs text-gray-400">{row.programId.slice(0, 8)}…</span>
        );
      },
    },
    {
      key: 'effectiveDate',
      header: 'Effective Date',
      render: (row: AdminCatalogYear) => <span>{row.effectiveDate ?? '—'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row: AdminCatalogYear) => (
        <span>{new Date(row.createdAt).toLocaleDateString()}</span>
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} />;
}
