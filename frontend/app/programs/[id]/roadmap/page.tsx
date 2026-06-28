import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '../../../../lib/api';
import { RoadmapCanvas } from '../../../../components/roadmap/RoadmapCanvas';
import { Breadcrumb } from '../../../../components/ui/Breadcrumb';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const roadmap = await api.programs.roadmap(id);
    return {
      title: `${roadmap.programAbbreviation} Curriculum Roadmap`,
      description: `Curriculum roadmap for ${roadmap.programName}.`,
    };
  } catch {
    return { title: 'Curriculum Roadmap' };
  }
}

export default async function RoadmapPage({ params }: Props) {
  const { id } = await params;

  let roadmap;
  try {
    roadmap = await api.programs.roadmap(id);
  } catch {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/60 text-sm font-medium mb-1 uppercase tracking-widest">
            Curriculum Roadmap
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold">{roadmap.programName}</h1>
          {roadmap.academicYear && (
            <p className="text-white/60 text-sm mt-1">Catalog Year {roadmap.academicYear}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Programs', href: '/programs' },
            { label: roadmap.programAbbreviation, href: `/programs/${roadmap.programId}` },
            { label: 'Curriculum Roadmap' },
          ]}
        />

        <div className="mt-6">
          {roadmap.phases.length === 0 ? (
            <p className="text-gray-400 py-16 text-center">No roadmap data available.</p>
          ) : (
            <RoadmapCanvas phases={roadmap.phases} academicYear={roadmap.academicYear} />
          )}
        </div>
      </div>
    </div>
  );
}
