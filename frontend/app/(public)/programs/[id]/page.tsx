import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '../../../../lib/api';
import { ProgramHero } from '../../../../components/programs/ProgramHero';
import { RequirementSummary } from '../../../../components/programs/RequirementSummary';
import { ProgramNavigation } from '../../../../components/programs/ProgramNavigation';
import { Breadcrumb } from '../../../../components/ui/Breadcrumb';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const program = await api.programs.get(id);
    return { title: program.name, description: program.description ?? undefined };
  } catch {
    return { title: 'Program Not Found' };
  }
}

export default async function ProgramDetailPage({ params }: Props) {
  const { id } = await params;

  let program, requirements;
  try {
    [program, requirements] = await Promise.all([
      api.programs.get(id),
      api.programs.requirements(id),
    ]);
  } catch {
    notFound();
  }

  const latestYear = requirements.catalogYears[0];

  return (
    <div>
      <ProgramHero program={program} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Programs', href: '/programs' },
            { label: program.abbreviation },
          ]}
        />

        <div className="space-y-10">
          {latestYear ? (
            <RequirementSummary
              groups={latestYear.requirementGroups}
              academicYear={latestYear.academicYear}
            />
          ) : (
            <p className="text-gray-400">No requirement data available.</p>
          )}

          {requirements.catalogYears.length > 1 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Available Catalog Years</h2>
              <div className="flex flex-wrap gap-2">
                {requirements.catalogYears.map((cy) => (
                  <span
                    key={cy.id}
                    className="rounded-full border border-gray-200 bg-white px-4 py-1 text-sm text-gray-600"
                  >
                    {cy.academicYear}
                  </span>
                ))}
              </div>
            </section>
          )}

          <ProgramNavigation programId={program.id} abbreviation={program.abbreviation} />
        </div>
      </div>
    </div>
  );
}
