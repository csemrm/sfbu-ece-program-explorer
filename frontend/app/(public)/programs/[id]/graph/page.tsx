import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '../../../../../lib/api';
import { GraphPageClient } from '../../../../../components/graph/GraphPageClient';
import { Breadcrumb } from '../../../../../components/ui/Breadcrumb';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const g = await api.programs.graph(id);
    return {
      title: `${g.programAbbreviation} Prerequisite Graph`,
      description: `Interactive prerequisite graph for ${g.programName}.`,
    };
  } catch {
    return { title: 'Prerequisite Graph' };
  }
}

export default async function GraphPage({ params }: Props) {
  const { id } = await params;

  let graphData;
  try {
    graphData = await api.programs.graph(id);
  } catch {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-950 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/60 text-sm font-medium mb-1 uppercase tracking-widest">
            Prerequisite Graph
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold">{graphData.programName}</h1>
          <p className="text-white/60 text-sm mt-1">
            {graphData.nodes.length} courses · {graphData.edges.length} relationships
            {graphData.academicYear ? ` · Catalog ${graphData.academicYear}` : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Programs', href: '/programs' },
            { label: graphData.programAbbreviation, href: `/programs/${graphData.programId}` },
            { label: 'Prerequisite Graph' },
          ]}
        />

        <p className="text-sm text-gray-500 mt-3 mb-4">
          Click a course node to see details. Blue highlighted edges show direct connections. Scroll
          to zoom · drag to pan.
        </p>

        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <GraphPageClient graphData={graphData} />
        </div>
      </div>
    </div>
  );
}
