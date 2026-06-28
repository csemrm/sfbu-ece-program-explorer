import { cookies } from 'next/headers';
import Link from 'next/link';
import { adminApi } from '../../../../../lib/admin-api';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  let stats: Awaited<ReturnType<typeof adminApi.dashboard.stats>>;
  try {
    stats = await adminApi.dashboard.stats(token);
  } catch {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load dashboard data</p>
          <p className="text-red-500 text-sm">
            The API may be temporarily unavailable. Please refresh.
          </p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: 'Programs',
      value: stats.programs,
      href: '/admin/programs',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Courses',
      value: stats.courses,
      href: '/admin/courses',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'Catalog Years',
      value: stats.catalogYears,
      href: '/admin/catalog-years',
      color: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-xl p-6 ${c.color} hover:opacity-90 transition-opacity`}
          >
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-sm font-medium mt-1 opacity-80">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Activity</h2>
        </div>
        {stats.recentActivity.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {stats.recentActivity.map((entry) => (
              <li key={entry.id} className="px-5 py-3 flex items-center justify-between text-sm">
                <span>
                  <span className="font-medium text-gray-700">{entry.action}</span>{' '}
                  <span className="text-gray-500">{entry.entityType}</span>
                  {entry.entityId && (
                    <span className="text-gray-400 ml-1 font-mono text-xs">
                      {entry.entityId.slice(0, 8)}
                    </span>
                  )}
                </span>
                <span className="text-gray-400 text-xs">{entry.adminEmail ?? 'system'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
