import type { Program } from '../../lib/api';

const GRADIENT: Record<string, string> = {
  BSCS: 'linear-gradient(135deg, #1c3766 0%, #0d2144 100%)',
  MSCS: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)',
  MSEE: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
};

const CREDIT_TOTALS: Record<string, number> = {
  BSCS: 120,
  MSCS: 36,
  MSEE: 36,
};

export function ProgramHero({ program }: { program: Program }) {
  const abbr = program.abbreviation;
  const gradient = GRADIENT[abbr] ?? 'linear-gradient(135deg, #374151 0%, #111827 100%)';

  return (
    <div className="text-white relative overflow-hidden" style={{ background: gradient }}>
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, white 1px, transparent 0), radial-gradient(circle at 75% 75%, white 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Gold accent bar at top */}
      <div
        className="h-1 w-full absolute top-0 left-0"
        style={abbr === 'BSCS' ? { backgroundColor: 'var(--sfbu-gold)' } : {}}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
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
