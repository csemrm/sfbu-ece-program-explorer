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

const SPEC_COLOR = 'bg-amber-600';

function isSpecialization(name: string) {
  return name.toLowerCase().includes('specialization');
}

// Sum minCredits per phase, counting only ONE specialization track.
// Students choose one specialization — all tracks are shown so they can compare options.
function computeRequiredCredits(phases: RoadmapPhase[]): number {
  let total = 0;
  let specCounted = false;
  for (const p of phases) {
    const mc = Number(p.minCredits ?? 0);
    const courseCr = p.courses.reduce((s, c) => s + parseFloat(String(c.creditHours)), 0);
    const credits = mc > 0 ? mc : courseCr; // minCredits is authoritative
    if (!credits) continue;
    if (isSpecialization(p.name)) {
      if (!specCounted) {
        total += credits;
        specCounted = true;
      }
    } else {
      total += credits;
    }
  }
  return total;
}

export function RoadmapCanvas({ phases, academicYear }: Props) {
  const [zoom, setZoom] = useState(100);

  const specPhases = phases.filter((p) => isSpecialization(p.name));
  const hasSpecializations = specPhases.length > 1;
  const requiredCredits = computeRequiredCredits(phases);

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
          <span className="font-semibold text-gray-700">{requiredCredits} credits required</span>
          {academicYear && <span>Catalog {academicYear}</span>}
        </div>
      </div>

      {/* Specialization notice */}
      {hasSpecializations && (
        <div className="mb-4 px-1">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 flex items-start gap-2.5">
            <span className="text-amber-600 mt-0.5 shrink-0">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-semibold">Choose one specialization track</span> — all{' '}
              {specPhases.length} options are shown for comparison. Required credits (
              {requiredCredits} total) count only one specialization.
            </p>
          </div>
        </div>
      )}

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
        {hasSpecializations && (
          <span className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
            Specialization (choose one)
          </span>
        )}
        <span className="text-xs text-gray-400 ml-2">Click any course to view details.</span>
      </div>

      {/* Scrollable canvas */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4 transition-all duration-200" style={{ zoom: `${zoom}%` }}>
          {phases.map((phase, i) => (
            <PhaseColumn
              key={phase.id}
              phase={phase}
              colorClass={
                isSpecialization(phase.name) ? SPEC_COLOR : COLUMN_COLORS[i % COLUMN_COLORS.length]
              }
              isSpecialization={isSpecialization(phase.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
