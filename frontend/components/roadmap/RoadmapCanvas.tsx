'use client';

import { useState } from 'react';
import type { RoadmapPhase } from '../../lib/api';
import { PhaseColumn } from './PhaseColumn';

interface Props {
  phases: RoadmapPhase[];
  academicYear: string | null;
}

const COLUMN_COLORS = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-purple-600',
  'bg-fuchsia-600',
  'bg-pink-600',
  'bg-rose-600',
  'bg-orange-600',
];

export function RoadmapCanvas({ phases, academicYear }: Props) {
  const [zoom, setZoom] = useState(100);

  const totalCredits = phases.reduce((sum, p) => {
    const courseCr = p.courses.reduce((s, c) => s + parseFloat(String(c.creditHours)), 0);
    return sum + (courseCr > 0 ? courseCr : parseFloat(String(p.minCredits ?? 0)));
  }, 0);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Zoom</span>
            <input
              type="range"
              min={50}
              max={150}
              step={10}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-28 accent-blue-600"
            />
            <span className="text-xs text-gray-500 w-8">{zoom}%</span>
          </div>
          <button
            onClick={() => setZoom(100)}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Reset
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{phases.length} phases</span>
          <span className="font-semibold text-gray-700">{totalCredits} total credits</span>
          {academicYear && <span>Catalog {academicYear}</span>}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 px-1 flex-wrap">
        <span className="text-xs text-gray-500 font-medium">Level:</span>
        <span className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" />
          Undergraduate
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-600">
          <span className="w-3 h-3 rounded-sm bg-purple-400 inline-block" />
          Graduate
        </span>
        <span className="text-xs text-gray-400 ml-2">Click any course to view details.</span>
      </div>

      {/* Scrollable canvas */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4 transition-all duration-200" style={{ zoom: `${zoom}%` }}>
          {phases.map((phase, i) => (
            <PhaseColumn
              key={phase.id}
              phase={phase}
              colorClass={COLUMN_COLORS[i % COLUMN_COLORS.length]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
