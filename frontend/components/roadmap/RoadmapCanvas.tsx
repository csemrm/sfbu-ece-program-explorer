'use client';

import { useState } from 'react';
import type { ProgramRoadmap, RoadmapPhase } from '../../lib/api';
import { isAlternativeGroup, requiredCreditsFromRoadmap } from '../../lib/programScope';
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

// Sum minCredits per phase, counting only ONE alternative group. Students choose
// a single specialization or cluster; all are shown so they can compare options.
// Shared with the planner so both agree on what a degree costs.
function computeRequiredCredits(phases: RoadmapPhase[]): number {
  return requiredCreditsFromRoadmap({ phases } as ProgramRoadmap);
}

export function RoadmapCanvas({ phases, academicYear }: Props) {
  const [zoom, setZoom] = useState(100);
  /** The one track the student is comparing against, or null for all of them. */
  const [chosenTrack, setChosenTrack] = useState<string | null>(null);

  const specPhases = phases.filter((p) => isAlternativeGroup(p.name));
  const hasSpecializations = specPhases.length > 1;

  /**
   * Choosing a track hides the alternatives it competes with.
   *
   * A student picks one, so showing all seven side by side is only useful while
   * comparing them — once the choice is made the others are noise between the
   * columns that still matter. Deselecting brings them back.
   *
   * Credits are computed from the full set either way, since the requirement is
   * the same whichever track is chosen.
   */
  const visiblePhases = chosenTrack
    ? phases.filter((p) => !isAlternativeGroup(p.name) || p.id === chosenTrack)
    : phases;
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
              // The visible "Zoom" text is a span, not a label, so the control
              // had no accessible name at all.
              aria-label="Zoom the roadmap"
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
            // Resets the whole view, not just the zoom — a hidden track is part
            // of what the user is looking at.
            onClick={() => {
              setZoom(100);
              setChosenTrack(null);
            }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Reset
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>
            {visiblePhases.length} phase{visiblePhases.length !== 1 ? 's' : ''}
            {chosenTrack && ` of ${phases.length}`}
          </span>
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
            <div className="min-w-0">
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">Choose one specialization track</span> —{' '}
                {chosenTrack
                  ? 'the other tracks are hidden. Select it again to compare them.'
                  : `all ${specPhases.length} options are shown for comparison.`}{' '}
                Required credits ({requiredCredits} total) count only one specialization.
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {specPhases.map((p) => {
                  const active = chosenTrack === p.id;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setChosenTrack(active ? null : p.id)}
                        aria-pressed={active}
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                          active
                            ? 'border-amber-600 bg-amber-600 text-white'
                            : 'border-amber-300 bg-white text-amber-800 hover:bg-amber-100'
                        }`}
                      >
                        {p.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
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
          {visiblePhases.map((phase, i) => (
            <PhaseColumn
              key={phase.id}
              phase={phase}
              colorClass={
                isAlternativeGroup(phase.name)
                  ? SPEC_COLOR
                  : COLUMN_COLORS[i % COLUMN_COLORS.length]
              }
              isSpecialization={isAlternativeGroup(phase.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
