'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/programs', label: 'Programs' },
  { href: '/courses', label: 'Courses' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 text-white shadow-md"
      style={{ backgroundColor: 'var(--sfbu-navy)' }}
    >
      {/* Gold accent bar */}
      <div className="h-0.5 w-full" style={{ backgroundColor: 'var(--sfbu-gold)' }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold hover:opacity-90 transition-opacity"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: 'var(--sfbu-gold)' }}
          >
            SF
          </div>
          <div className="leading-tight">
            <p className="text-white font-semibold text-sm leading-none">SFBU ECE</p>
            <p className="text-white/50 text-[10px] hidden sm:block">Program Explorer</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/');
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
