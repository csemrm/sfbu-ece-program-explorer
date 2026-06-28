'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '../DataTable';
import type { AdminCatalogYear, AdminProgram } from '../../../lib/admin-api';
import { adminApi } from '../../../lib/admin-api';

interface Props {
  rows: AdminCatalogYear[];
  programs: Pick<AdminProgram, 'id' | 'abbreviation' | 'name'>[];
}

export function AdminCyClient({ rows, programs }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const programMap = new Map(programs.map((p) => [p.id, p]));

  async function handleDelete(id: string) {
    if (!confirm('Delete this catalog year? This will also delete all its requirement groups.'))
      return;
    setDeleting(id);
    try {
      const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
      await adminApi.catalogYears.delete(token, id);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  }

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

  return (
    <DataTable
      columns={columns}
      rows={rows}
      editHref={(row) => `/admin/catalog-years/${row.id}/edit`}
      onDelete={handleDelete}
      deleting={deleting}
    />
  );
}
