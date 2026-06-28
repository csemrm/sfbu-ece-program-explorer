'use client';

import { useState } from 'react';
import type { RoadmapPhase } from '../../lib/api';
import { RoadmapCourseCard } from './RoadmapCourseCard';

interface Props {
  phase: RoadmapPhase;
  colorClass: string;
}

export function PhaseColumn({ phase, colorClass }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const creditTotal = phase.courses.reduce((sum, c) => sum + parseFloat(String(c.creditHours)), 0);

  return (
    <div className="flex-shrink-0 w-56 flex flex-col">
      {/* Header */}
      <div className={`rounded-t-xl px-3 py-3 ${colorClass}`}>
        <div className="flex items-start justify-between gap-1">
          <h3 className="text-xs font-bold text-white leading-snug">{phase.name}</h3>
          <button
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? 'Expand' : 'Collapse'}
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors mt-0.5"
          >
            <svg
              className={`w-4 h-4 transition-transform ${collapsed ? '-rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-white/80">
            {phase.courses.length > 0
              ? `${phase.courses.length} course${phase.courses.length !== 1 ? 's' : ''}`
              : 'Credit requirement'}
          </span>
          {(creditTotal > 0 || phase.minCredits) && (
            <span className="text-xs font-semibold text-white bg-white/20 rounded-full px-2 py-0.5">
              {creditTotal > 0 ? creditTotal : phase.minCredits} cr
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="flex-1 rounded-b-xl border border-t-0 border-gray-200 bg-gray-50 p-2 space-y-2 min-h-20">
          {phase.courses.length > 0 ? (
            phase.courses.map((course) => <RoadmapCourseCard key={course.id} course={course} />)
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-3 text-center">
              <p className="text-xs text-gray-400">
                {phase.minCredits
                  ? `${phase.minCredits} credits required`
                  : 'See catalog for details'}
              </p>
              {phase.description && (
                <p className="text-xs text-gray-400 mt-1 leading-snug">{phase.description}</p>
              )}
            </div>
          )}
        </div>
      )}

      {collapsed && (
        <div className="rounded-b-xl border border-t-0 border-gray-200 bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-400 italic">Collapsed</p>
        </div>
      )}
    </div>
  );
}
