import { cookies } from 'next/headers';
import Link from 'next/link';
import { adminApi } from '../../../../../lib/admin-api';

export const metadata = { title: 'Audit Log' };

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AuditLogPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  let result: Awaited<ReturnType<typeof adminApi.auditLog.list>>;
  try {
    result = await adminApi.auditLog.list(token, page);
  } catch {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Audit Log</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load audit log</p>
          <p className="text-red-500 text-sm">
            The API may be temporarily unavailable. Please refresh.
          </p>
        </div>
      </div>
    );
  }
  const totalPages = Math.ceil(result.total / result.limit);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Audit Log</h1>

      <div className="bg-white rounded-xl border border-gray-200">
        {result.data.length === 0 ? (
          <p className="text-center py-16 text-gray-400 text-sm">No audit entries yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Time', 'User', 'Action', 'Entity', 'ID'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.data.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{entry.adminEmail ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block bg-slate-100 text-slate-700 text-xs rounded px-2 py-0.5 font-mono">
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{entry.entityType}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    {entry.entityId?.slice(0, 8) ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>
              {result.total} entries · page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/audit-log?page=${page - 1}`}
                  className="px-3 py-1 rounded border hover:bg-gray-50"
                >
                  ←
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/audit-log?page=${page + 1}`}
                  className="px-3 py-1 rounded border hover:bg-gray-50"
                >
                  →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
