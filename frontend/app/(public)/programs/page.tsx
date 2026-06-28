import type { Metadata } from 'next';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { ProgramCard } from '../../../components/programs/ProgramCard';
import { Breadcrumb } from '../../../components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Programs',
  description: 'Browse BSCS, MSCS, and MSEE programs at San Francisco Bay University.',
};

export default async function ProgramsPage() {
  let programs: Awaited<ReturnType<typeof api.programs.list>>['data'] = [];
  let fetchError = false;
  try {
    const result = await api.programs.list({ limit: 100 });
    programs = result.data;
  } catch {
    fetchError = true;
  }

  if (fetchError) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load programs</p>
          <p className="text-red-500 text-sm">
            The server may be temporarily unavailable. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-7">
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Programs' }]} />
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'var(--sfbu-gold)' }}
          >
            ECE Department
          </p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Academic Programs</h1>
              <p className="text-gray-500 mt-1.5 text-base">
                Undergraduate and graduate programs in Computer Science and Electrical Engineering.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1.5 pb-0.5 shrink-0">
              <span className="text-sm text-gray-400">
                {programs.length} program{programs.length !== 1 ? 's' : ''}
              </span>
              <Link
                href="/programs/compare"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--sfbu-navy)' }}
              >
                Compare programs →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
        {programs.length === 0 && (
          <p className="text-center text-gray-400 py-16">No programs found.</p>
        )}

        {/* Bottom CTA */}
        {programs.length > 0 && (
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Looking for course details, prerequisites, and semester roadmaps?
            </p>
            <Link
              href="/courses"
              className="inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--sfbu-navy)' }}
            >
              Browse the Course Catalog →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
