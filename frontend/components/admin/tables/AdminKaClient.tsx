'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '../DataTable';
import { ConfirmDialog } from '../ConfirmDialog';
import type { AdminKnowledgeArea } from '../../../lib/admin-api';
import { adminApi } from '../../../lib/admin-api';

export function AdminKaClient({ rows }: { rows: AdminKnowledgeArea[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    setConfirmId(null);
    try {
      const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
      await adminApi.knowledgeAreas.delete(token, id);
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'description',
      header: 'Description',
      render: (row: AdminKnowledgeArea) => (
        <span className="text-gray-500 line-clamp-1">{row.description ?? '—'}</span>
      ),
    },
  ];

  return (
    <>
      {confirmId && (
        <ConfirmDialog
          title="Delete Knowledge Area"
          message="This will delete the knowledge area. Continue?"
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
      <DataTable
        columns={columns}
        rows={rows}
        onDelete={(id) => setConfirmId(id)}
        deleting={deleting}
      />
    </>
  );
}
