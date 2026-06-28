'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DataTable } from '../DataTable';
import { ConfirmDialog } from '../ConfirmDialog';
import type { AdminCourse } from '../../../lib/admin-api';
import { adminApi } from '../../../lib/admin-api';

interface Props {
  rows: AdminCourse[];
  total: number;
  page: number;
  limit: number;
}

export function AdminCoursesTable({ rows, total, page, limit }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    setConfirmId(null);
    try {
      const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
      await adminApi.courses.delete(token, id);
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  const columns = [
    { key: 'courseCode', header: 'Code' },
    { key: 'title', header: 'Title' },
    {
      key: 'level',
      header: 'Level',
      render: (row: AdminCourse) => (
        <span
          className={`text-xs rounded-full px-2 py-0.5 font-medium ${
            row.level === 'graduate' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          }`}
        >
          {row.level === 'graduate' ? 'Grad' : 'UG'}
        </span>
      ),
    },
    {
      key: 'creditHours',
      header: 'Credits',
      render: (row: AdminCourse) => <span>{row.creditHours}cr</span>,
    },
  ];

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      {confirmId && (
        <ConfirmDialog
          title="Delete Course"
          message="This will permanently delete the course and all its prerequisites. Continue?"
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
      <DataTable
        columns={columns}
        rows={rows}
        editHref={(row) => `/admin/courses/${row.id}/edit`}
        onDelete={(id) => setConfirmId(id)}
        deleting={deleting}
      />
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>
            {total} courses · page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/courses?page=${page - 1}`}
                className="px-3 py-1 rounded border hover:bg-gray-50"
              >
                ←
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/courses?page=${page + 1}`}
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
