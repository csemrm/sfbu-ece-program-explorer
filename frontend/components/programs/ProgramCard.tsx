import Link from 'next/link';
import type { Program } from '../../lib/api';

const DEGREE_LABELS: Record<string, string> = {
  BSCS: 'Bachelor of Science',
  MSCS: 'Master of Science',
  MSEE: 'Master of Science',
};

const CREDIT_TOTALS: Record<string, number> = {
  BSCS: 120,
  MSCS: 36,
  MSEE: 36,
};

const ACCENT: Record<string, string> = {
  BSCS: 'bg-blue-50 border-blue-200 hover:border-blue-400',
  MSCS: 'bg-purple-50 border-purple-200 hover:border-purple-400',
  MSEE: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
};

const BADGE: Record<string, string> = {
  BSCS: 'bg-blue-100 text-blue-800',
  MSCS: 'bg-purple-100 text-purple-800',
  MSEE: 'bg-emerald-100 text-emerald-800',
};

export function ProgramCard({ program }: { program: Program }) {
  const abbr = program.abbreviation;
  return (
    <Link
      href={`/programs/${program.id}`}
      className={`block rounded-xl border-2 p-6 transition-all duration-200 ${ACCENT[abbr] ?? 'bg-gray-50 border-gray-200 hover:border-gray-400'}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide ${BADGE[abbr] ?? 'bg-gray-100 text-gray-800'}`}
        >
          {abbr}
        </span>
        {CREDIT_TOTALS[abbr] && (
          <span className="text-xs text-gray-500 font-medium">{CREDIT_TOTALS[abbr]} credits</span>
        )}
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{program.name}</h2>
      {DEGREE_LABELS[abbr] && (
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">{DEGREE_LABELS[abbr]}</p>
      )}
      {program.description && (
        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{program.description}</p>
      )}
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-700">
        Explore program
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
