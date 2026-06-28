'use client';

import Link from 'next/link';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface Props<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  editHref?: (row: T) => string;
  onDelete?: (id: string) => void;
  deleting?: string | null;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  editHref,
  onDelete,
  deleting,
}: Props<T>) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">
        No records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
              >
                {col.header}
              </th>
            ))}
            {(editHref || onDelete) && (
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
              {(editHref || onDelete) && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {editHref && (
                      <Link
                        href={editHref(row)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-xs"
                      >
                        Edit
                      </Link>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id)}
                        disabled={deleting === row.id}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-xs disabled:opacity-40"
                      >
                        {deleting === row.id ? 'Deleting…' : 'Delete'}
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
