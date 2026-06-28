import type { Metadata } from 'next';
import { api } from '../../../lib/api';
import { ProgramCard } from '../../../components/programs/ProgramCard';
import { Breadcrumb } from '../../../components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Programs',
  description: 'Browse BSCS, MSCS, and MSEE programs at San Francisco Bay University.',
};

export default async function ProgramsPage() {
  const result = await api.programs.list({ limit: 100 });
  const programs = result.data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Programs' }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Programs</h1>
        <p className="text-gray-500 text-lg">
          Explore undergraduate and graduate programs in Computer Science and Electrical
          Engineering.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      {programs.length === 0 && (
        <p className="text-center text-gray-400 py-16">No programs found.</p>
      )}
    </div>
  );
}
