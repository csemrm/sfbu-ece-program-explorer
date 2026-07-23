import type { Metadata } from 'next';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { KnowledgeAreaCard } from '../../../components/knowledge-areas/KnowledgeAreaCard';
import { Breadcrumb } from '../../../components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Knowledge Areas',
  description:
    'Explore SFBU ECE courses grouped by learning domain — from programming foundations to VLSI design.',
};

export default async function KnowledgeAreasPage() {
  let areas: Awaited<ReturnType<typeof api.knowledgeAreas.list>>['data'] = [];
  let fetchError = false;
  try {
    const result = await api.knowledgeAreas.list({ limit: 100 });
    areas = result.data;
  } catch {
    fetchError = true;
  }

  if (fetchError) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load knowledge areas</p>
          <p className="text-red-500 text-sm">
            The server may be temporarily unavailable. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const totalCourses = areas.reduce((sum, a) => sum + a.courseCount, 0);

  return (
    <div>
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-7">
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Knowledge Areas' }]} />
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'var(--sfbu-gold)' }}
          >
            Learning Domains
          </p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Knowledge Areas</h1>
              <p className="text-gray-500 mt-1.5 text-base max-w-2xl">
                Courses grouped by subject matter rather than by degree requirement. Use these to
                find the areas you want to study — a course can belong to more than one.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1.5 pb-0.5 shrink-0">
              <span className="text-sm text-gray-400">
                {areas.length} area{areas.length !== 1 ? 's' : ''}
              </span>
              <Link
                href="/courses"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--sfbu-navy)' }}
              >
                Browse all courses →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <KnowledgeAreaCard key={area.id} area={area} />
          ))}
        </div>

        {areas.length === 0 && (
          <p className="text-center text-gray-400 py-16">No knowledge areas found.</p>
        )}

        {areas.length > 0 && (
          <p className="mt-8 text-center text-xs text-gray-400">
            {totalCourses} course assignments across {areas.length} areas. Courses that span
            multiple domains are counted in each.
          </p>
        )}
      </div>
    </div>
  );
}
