'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '../DataTable';
import { ConfirmDialog } from '../ConfirmDialog';
import type { AdminRequirementGroup } from '../../../lib/admin-api';
import { adminApi } from '../../../lib/admin-api';

export function AdminRgClient({ rows }: { rows: AdminRequirementGroup[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    setConfirmId(null);
    try {
      const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
      await adminApi.requirementGroups.delete(token, id);
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'minCredits',
      header: 'Min Credits',
      render: (row: AdminRequirementGroup) => <span>{row.minCredits ?? '—'}</span>,
    },
    { key: 'sortOrder', header: 'Sort Order' },
    {
      key: 'description',
      header: 'Description',
      render: (row: AdminRequirementGroup) => (
        <span className="text-gray-500 line-clamp-1">{row.description ?? '—'}</span>
      ),
    },
  ];

  return (
    <>
      {confirmId && (
        <ConfirmDialog
          title="Delete Requirement Group"
          message="This will delete the requirement group and its course assignments. Continue?"
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
      <DataTable
        columns={columns}
        rows={rows}
        editHref={(row) => `/admin/requirement-groups/${row.id}/edit`}
        onDelete={(id) => setConfirmId(id)}
        deleting={deleting}
      />
    </>
  );
}
