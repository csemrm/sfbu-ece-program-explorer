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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-6 py-10 text-center">
          <p className="text-red-700 dark:text-red-300 font-medium mb-1">
            Unable to load dashboard data
          </p>
          <p className="text-red-500 dark:text-red-400 text-sm">
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
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      accent: 'var(--sfbu-navy)',
    },
    {
      label: 'Courses',
      value: stats.courses,
      href: '/admin/courses',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
      accent: 'var(--sfbu-gold)',
    },
    {
      label: 'Catalog Years',
      value: stats.catalogYears,
      href: '/admin/catalog-years',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      accent: '#16a34a',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          ECE curriculum administration overview
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: c.accent }}
              >
                {c.icon}
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors mt-1"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{c.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          <Link
            href="/admin/audit-log"
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            View all →
          </Link>
        </div>
        {stats.recentActivity.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-gray-700">
            {stats.recentActivity.map((entry) => (
              <li key={entry.id} className="px-5 py-3 flex items-center justify-between text-sm">
                <span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {entry.action}
                  </span>{' '}
                  <span className="text-gray-500 dark:text-gray-400">{entry.entityType}</span>
                  {entry.entityId && (
                    <span className="text-gray-400 dark:text-gray-500 ml-1 font-mono text-xs">
                      {entry.entityId.slice(0, 8)}
                    </span>
                  )}
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-xs">
                  {entry.adminEmail ?? 'system'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
