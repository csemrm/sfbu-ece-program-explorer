'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAdmin } from '../../lib/admin-api';
import { useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '▪' },
  { href: '/admin/programs', label: 'Programs', icon: '▪' },
  { href: '/admin/courses', label: 'Courses', icon: '▪' },
  { href: '/admin/requirement-groups', label: 'Requirement Groups', icon: '▪' },
  { href: '/admin/knowledge-areas', label: 'Knowledge Areas', icon: '▪' },
  { href: '/admin/catalog-years', label: 'Catalog Years', icon: '▪' },
  { href: '/admin/audit-log', label: 'Audit Log', icon: '▪' },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logoutAdmin();
    router.push('/admin/login');
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-slate-700">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Admin Portal</p>
        <p className="font-semibold text-white text-sm truncate">SFBU ECE Explorer</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 truncate mb-2">{email}</p>
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-slate-400 hover:text-white transition-colors px-2 py-1"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
