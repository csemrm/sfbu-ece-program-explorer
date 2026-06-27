import Link from 'next/link';

const links = [
  { href: '/programs', label: 'Programs' },
  { href: '/courses', label: 'Courses' },
];

export function Nav() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-gray-900 hover:text-blue-700 transition-colors"
        >
          <span className="text-blue-700 text-lg">SFBU</span>
          <span className="hidden sm:inline text-sm font-medium text-gray-600">
            ECE Program Explorer
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
