'use client';

import dynamic from 'next/dynamic';
import type { ProgramGraph } from '../../lib/api';

const GraphCanvas = dynamic(
  () => import('./GraphCanvas').then((m) => ({ default: m.GraphCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 text-gray-400 text-sm">
        Loading graph…
      </div>
    ),
  },
);

interface Props {
  graphData: ProgramGraph;
}

export function GraphPageClient({ graphData }: Props) {
  if (graphData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No graph data available.
      </div>
    );
  }
  return <GraphCanvas graphData={graphData} />;
}
