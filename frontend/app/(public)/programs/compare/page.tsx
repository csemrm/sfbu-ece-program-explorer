import type { Metadata } from 'next';
import Link from 'next/link';
import { api } from '../../../../lib/api';
import { Breadcrumb } from '../../../../components/ui/Breadcrumb';
import type { ProgramRoadmap } from '../../../../lib/api';

export const metadata: Metadata = {
  title: 'Compare Programs',
  description: 'Side-by-side comparison of BSCS, MSCS, and MSEE programs at SFBU.',
};

// ── Program-level constants ────────────────────────────────────────────────

const DEGREE_META: Record<
  string,
  { type: string; duration: string; color: string; bg: string; border: string }
> = {
  BSCS: {
    type: 'Bachelor of Science',
    duration: '4 years',
    color: '#1c3766',
    bg: '#f0f4fa',
    border: '#c5d3e8',
  },
  MSCS: {
    type: 'Master of Science',
    duration: '1–2 years',
    color: '#6d28d9',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
  MSEE: {
    type: 'Master of Science',
    duration: '1–2 years',
    color: '#065f46',
    bg: '#ecfdf5',
    border: '#a7f3d0',
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────

interface ProgramStats {
  id: string;
  name: string;
  abbreviation: string;
  totalCredits: number;
  totalCourses: number;
  ugCourses: number;
  gradCourses: number;
  phaseCount: number;
  academicYear: string | null;
  phases: ProgramRoadmap['phases'];
}

function computeStats(roadmap: ProgramRoadmap): ProgramStats {
  const allCourses = roadmap.phases.flatMap((p) => p.courses);
  return {
    id: roadmap.programId,
    name: roadmap.programName,
    abbreviation: roadmap.programAbbreviation,
    totalCredits: allCourses.reduce((sum, c) => sum + c.creditHours, 0),
    totalCourses: allCourses.length,
    ugCourses: allCourses.filter((c) => c.level === 'undergraduate').length,
    gradCourses: allCourses.filter((c) => c.level === 'graduate').length,
    phaseCount: roadmap.phases.length,
    academicYear: roadmap.academicYear,
    phases: roadmap.phases,
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ProgramHeaderCard({ stats }: { stats: ProgramStats }) {
  const meta = DEGREE_META[stats.abbreviation];
  return (
    <div
      className="rounded-2xl border-2 p-6 flex flex-col gap-3"
      style={{ backgroundColor: meta?.bg ?? '#f9fafb', borderColor: meta?.border ?? '#e5e7eb' }}
    >
      <div className="flex items-start justify-between">
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white"
          style={{ backgroundColor: meta?.color ?? '#374151' }}
        >
          {stats.abbreviation}
        </span>
        {meta && <span className="text-xs text-gray-400 font-medium">{meta.duration}</span>}
      </div>
      <div>
        <h2 className="text-base font-bold text-gray-900 leading-snug">{stats.name}</h2>
        {meta && (
          <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">{meta.type}</p>
        )}
      </div>
      <div className="mt-auto pt-2 border-t border-gray-200/60">
        <span className="text-4xl font-extrabold" style={{ color: meta?.color ?? '#374151' }}>
          {stats.totalCredits}
        </span>
        <span className="text-sm text-gray-500 ml-1.5">credits required</span>
      </div>
    </div>
  );
}

function CreditBar({ stats, maxCredits }: { stats: ProgramStats; maxCredits: number }) {
  const meta = DEGREE_META[stats.abbreviation];
  const pct = maxCredits > 0 ? Math.round((stats.totalCredits / maxCredits) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <span
        className="w-12 text-xs font-bold text-right shrink-0"
        style={{ color: meta?.color ?? '#374151' }}
      >
        {stats.abbreviation}
      </span>
      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
        <div
          className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
          style={{ width: `${pct}%`, backgroundColor: meta?.color ?? '#374151' }}
        />
      </div>
      <span className="w-20 text-sm font-semibold text-gray-700 shrink-0">
        {stats.totalCredits} cr
      </span>
    </div>
  );
}

function PhaseList({ stats }: { stats: ProgramStats }) {
  const meta = DEGREE_META[stats.abbreviation];
  if (stats.phases.length === 0) {
    return <p className="text-sm text-gray-400 italic">No phase data available.</p>;
  }
  return (
    <div className="space-y-2">
      {stats.phases.map((phase) => {
        const credits = phase.courses.reduce((sum, c) => sum + c.creditHours, 0);
        return (
          <div
            key={phase.id}
            className="flex items-center justify-between rounded-lg px-3 py-2.5 border"
            style={{
              borderColor: meta?.border ?? '#e5e7eb',
              backgroundColor: meta?.bg ?? '#f9fafb',
            }}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{phase.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {phase.courses.length} course{phase.courses.length !== 1 ? 's' : ''}
                {phase.minCredits ? ` · min ${phase.minCredits} cr` : ''}
              </p>
            </div>
            <span
              className="ml-3 shrink-0 text-sm font-bold"
              style={{ color: meta?.color ?? '#374151' }}
            >
              {credits} cr
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function ComparePage() {
  let statsList: ProgramStats[] = [];
  let fetchError = false;

  try {
    const { data: programs } = await api.programs.list({ limit: 100 });
    const roadmaps = await Promise.all(programs.map((p) => api.programs.roadmap(p.id)));
    statsList = roadmaps.map(computeStats);
    // Sort BSCS → MSCS → MSEE
    const ORDER = ['BSCS', 'MSCS', 'MSEE'];
    statsList.sort((a, b) => {
      const ai = ORDER.indexOf(a.abbreviation);
      const bi = ORDER.indexOf(b.abbreviation);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  } catch {
    fetchError = true;
  }

  if (fetchError) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load program data</p>
          <p className="text-red-500 text-sm">
            The server may be temporarily unavailable. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const maxCredits = Math.max(...statsList.map((s) => s.totalCredits), 1);

  const STAT_ROWS: { label: string; getValue: (s: ProgramStats) => string }[] = [
    { label: 'Total Credits', getValue: (s) => `${s.totalCredits}` },
    { label: 'Total Courses', getValue: (s) => `${s.totalCourses}` },
    { label: 'Undergraduate Courses', getValue: (s) => (s.ugCourses > 0 ? `${s.ugCourses}` : '—') },
    { label: 'Graduate Courses', getValue: (s) => (s.gradCourses > 0 ? `${s.gradCourses}` : '—') },
    { label: 'Requirement Phases', getValue: (s) => `${s.phaseCount}` },
    {
      label: 'Degree Level',
      getValue: (s) => DEGREE_META[s.abbreviation]?.type.split(' ')[0] ?? '—',
    },
    { label: 'Typical Duration', getValue: (s) => DEGREE_META[s.abbreviation]?.duration ?? '—' },
    { label: 'Catalog Year', getValue: (s) => s.academicYear ?? '—' },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-7">
          <Breadcrumb
            crumbs={[
              { label: 'Home', href: '/' },
              { label: 'Programs', href: '/programs' },
              { label: 'Compare' },
            ]}
          />
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'var(--sfbu-gold)' }}
          >
            ECE Department
          </p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compare Programs</h1>
              <p className="text-gray-500 mt-1.5 text-base">
                Side-by-side comparison of BSCS, MSCS, and MSEE degree requirements.
              </p>
            </div>
            <Link
              href="/programs"
              className="hidden sm:inline-block text-sm font-medium hover:underline pb-1 shrink-0"
              style={{ color: 'var(--sfbu-navy)' }}
            >
              ← All programs
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Program header cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statsList.map((s) => (
            <ProgramHeaderCard key={s.id} stats={s} />
          ))}
        </div>

        {/* Credit visualization */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Credit Hours</h2>
          <p className="text-sm text-gray-500 mb-5">
            Total credits required to complete each program.
          </p>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            {statsList.map((s) => (
              <CreditBar key={s.id} stats={s} maxCredits={maxCredits} />
            ))}
          </div>
        </section>

        {/* Stats comparison table */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Program Overview</h2>
          <p className="text-sm text-gray-500 mb-5">
            Key metrics compared across all three programs.
          </p>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--sfbu-navy)' }}>
                  <th className="text-left px-6 py-3.5 text-white/80 font-medium text-xs uppercase tracking-wider">
                    Metric
                  </th>
                  {statsList.map((s) => {
                    const meta = DEGREE_META[s.abbreviation];
                    return (
                      <th
                        key={s.id}
                        className="px-6 py-3.5 text-center text-white font-bold text-xs uppercase tracking-wider"
                        style={{ color: meta?.bg ?? 'white' }}
                      >
                        {s.abbreviation}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {STAT_ROWS.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-6 py-3.5 text-gray-500 font-medium">{row.label}</td>
                    {statsList.map((s) => (
                      <td
                        key={s.id}
                        className="px-6 py-3.5 text-center font-semibold text-gray-800"
                      >
                        {row.getValue(s)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Requirement phases breakdown */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Requirement Phases</h2>
          <p className="text-sm text-gray-500 mb-5">
            Each program's curriculum is organized into requirement phases with associated credit
            totals.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {statsList.map((s) => {
              const meta = DEGREE_META[s.abbreviation];
              return (
                <div key={s.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="inline-block rounded-full w-2.5 h-2.5"
                      style={{ backgroundColor: meta?.color ?? '#374151' }}
                    />
                    <h3 className="font-bold text-gray-900 text-sm">{s.abbreviation}</h3>
                    <span className="text-xs text-gray-400 ml-auto">{s.phaseCount} phases</span>
                  </div>
                  <PhaseList stats={s} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Explore CTAs */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Explore Each Program</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {statsList.map((s) => {
              const meta = DEGREE_META[s.abbreviation];
              return (
                <div
                  key={s.id}
                  className="rounded-2xl border-2 p-5 space-y-3"
                  style={{
                    borderColor: meta?.border ?? '#e5e7eb',
                    backgroundColor: meta?.bg ?? '#f9fafb',
                  }}
                >
                  <span
                    className="inline-block text-xs font-bold rounded-full px-3 py-1 text-white"
                    style={{ backgroundColor: meta?.color ?? '#374151' }}
                  >
                    {s.abbreviation}
                  </span>
                  <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      href={`/programs/${s.id}`}
                      className="rounded-lg text-center text-sm font-semibold py-2 text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: meta?.color ?? '#374151' }}
                    >
                      View Requirements
                    </Link>
                    <Link
                      href={`/programs/${s.id}/roadmap`}
                      className="rounded-lg text-center text-sm font-medium py-2 border-2 transition-colors hover:bg-white"
                      style={{
                        borderColor: meta?.color ?? '#374151',
                        color: meta?.color ?? '#374151',
                      }}
                    >
                      Curriculum Roadmap
                    </Link>
                    <Link
                      href={`/programs/${s.id}/graph`}
                      className="rounded-lg text-center text-sm font-medium py-2 border-2 transition-colors hover:bg-white"
                      style={{
                        borderColor: meta?.color ?? '#374151',
                        color: meta?.color ?? '#374151',
                      }}
                    >
                      Prerequisite Graph
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
