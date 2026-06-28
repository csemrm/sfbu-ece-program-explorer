'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '../DataTable';
import { ConfirmDialog } from '../ConfirmDialog';
import type { AdminRequirementGroup, AdminCatalogYear } from '../../../lib/admin-api';
import { adminApi } from '../../../lib/admin-api';

export function AdminRgClient({
  rows,
  catalogYears,
}: {
  rows: AdminRequirementGroup[];
  catalogYears: AdminCatalogYear[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const cyMap = new Map(catalogYears.map((cy) => [cy.id, cy]));

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
      key: 'catalogYearId',
      header: 'Catalog Year',
      render: (row: AdminRequirementGroup) => {
        const cy = cyMap.get(row.catalogYearId);
        return cy ? (
          <span className="text-gray-700">{cy.academicYear}</span>
        ) : (
          <span className="font-mono text-xs text-gray-400">{row.catalogYearId.slice(0, 8)}…</span>
        );
      },
    },
    {
      key: 'minCredits',
      header: 'Min Credits',
      render: (row: AdminRequirementGroup) => <span>{row.minCredits ?? '—'}</span>,
    },
    { key: 'sortOrder', header: 'Sort' },
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
