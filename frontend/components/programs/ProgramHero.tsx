import type { Program } from '../../lib/api';

const ACCENT: Record<string, string> = {
  BSCS: 'from-blue-700 to-blue-900',
  MSCS: 'from-purple-700 to-purple-900',
  MSEE: 'from-emerald-700 to-emerald-900',
};

const CREDIT_TOTALS: Record<string, number> = {
  BSCS: 120,
  MSCS: 36,
  MSEE: 36,
};

export function ProgramHero({ program }: { program: Program }) {
  const abbr = program.abbreviation;
  return (
    <div className={`bg-gradient-to-br ${ACCENT[abbr] ?? 'from-gray-700 to-gray-900'} text-white`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-bold tracking-widest">
            {abbr}
          </span>
          {CREDIT_TOTALS[abbr] && (
            <span className="inline-block bg-white/10 rounded-full px-4 py-1 text-sm">
              {CREDIT_TOTALS[abbr]} credits
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">{program.name}</h1>
        {program.description && (
          <p className="text-white/80 text-lg max-w-2xl leading-relaxed">{program.description}</p>
        )}
      </div>
    </div>
  );
}
