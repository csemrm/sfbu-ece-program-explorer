'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataTable } from '../DataTable';
import { ConfirmDialog } from '../ConfirmDialog';
import type { AdminProgram } from '../../../lib/admin-api';
import { adminApi } from '../../../lib/admin-api';

interface Props {
  rows: AdminProgram[];
  total: number;
  page: number;
  limit: number;
}

export function AdminProgramsTable({ rows, total, page, limit }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    setConfirmId(null);
    try {
      const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
      await adminApi.programs.delete(token, id);
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'abbreviation', header: 'Abbreviation' },
    {
      key: 'description',
      header: 'Description',
      render: (row: AdminProgram) => (
        <span className="text-gray-500 line-clamp-1">{row.description ?? '—'}</span>
      ),
    },
  ];

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      {confirmId && (
        <ConfirmDialog
          title="Delete Program"
          message="This will permanently delete the program. Continue?"
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
      <DataTable
        columns={columns}
        rows={rows}
        editHref={(row) => `/admin/programs/${row.id}/edit`}
        onDelete={(id) => setConfirmId(id)}
        deleting={deleting}
      />
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>
            {total} programs · page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/programs?page=${page - 1}`}
                className="px-3 py-1 rounded border hover:bg-gray-50"
              >
                ←
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/programs?page=${page + 1}`}
                className="px-3 py-1 rounded border hover:bg-gray-50"
              >
                →
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
