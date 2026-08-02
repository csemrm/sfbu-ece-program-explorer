'use client';

import { useState } from 'react';
import type { EvaluatedCourse } from '../../lib/api';

interface Props {
  termName: string | null;
  programLabel: string | null;
  /** Offered courses that are registrable now and not yet chosen. */
  recommended: EvaluatedCourse[];
  /** Offered courses the user has ticked. */
  selected: EvaluatedCourse[];
  completedCodes: string[];
  onAdd: (courseId: string) => void;
}

const credits = (courses: EvaluatedCourse[]) =>
  Math.round(courses.reduce((sum, c) => sum + c.creditHours, 0) * 10) / 10;

/**
 * Third planner column: what the term recommends, then what the user has
 * actually chosen, then a way to get that off the screen and onto paper.
 *
 * "Recommended" is drawn from the term's own offerings rather than the
 * planner API's `suggestions` feed: that feed answers "what would this plan
 * unlock later", which is a different question from "what should I register
 * for in this term".
 */
export function PlanSummaryColumn({
  termName,
  programLabel,
  recommended,
  selected,
  completedCodes,
  onAdd,
}: Props) {
  const [printedOn, setPrintedOn] = useState<string | null>(null);

  const blocked = selected.filter((c) => !c.eligible);
  const total = credits(selected);

  const download = () => {
    // Stamped on click rather than during render — a date computed while
    // rendering would differ between server and client markup.
    setPrintedOn(new Date().toLocaleDateString());
    setTimeout(() => window.print(), 0);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-800">
          {termName ? `Suggested for ${termName}` : 'Suggested'}
        </h2>
        <p className="text-xs text-gray-400">
          Ready to register, based on what you&rsquo;ve completed.
        </p>
      </div>

      {/* ── Recommended ── */}
      <div className="px-4 py-3">
        {recommended.length === 0 ? (
          <p className="py-3 text-center text-xs text-gray-400">
            {selected.length > 0
              ? 'You have chosen every course that is ready to register.'
              : 'Nothing is ready to register yet — mark more completed courses.'}
          </p>
        ) : (
          <ul className="space-y-1.5">
            {recommended.map((c) => (
              <li
                key={c.courseId}
                className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50/60 px-2.5 py-1.5"
              >
                <span className="w-[4.5rem] shrink-0 rounded bg-white px-1.5 py-0.5 text-center font-mono text-xs font-bold text-green-800">
                  {c.courseCode}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-gray-700">{c.title}</span>
                <span className="shrink-0 text-xs text-gray-400">{c.creditHours} cr</span>
                <button
                  type="button"
                  onClick={() => onAdd(c.courseId)}
                  className="shrink-0 rounded-lg border border-sfbu-navy px-2 py-0.5 text-xs font-medium text-sfbu-navy hover:bg-sfbu-navy hover:text-white"
                  aria-label={`Add ${c.courseCode} to your plan`}
                >
                  + Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Your plan ── */}
      <div className="border-t border-gray-100 px-4 py-3">
        <h3 className="text-xs font-semibold text-gray-700">
          Your plan
          <span className="ml-1.5 font-normal text-gray-400">
            {selected.length} course{selected.length !== 1 ? 's' : ''} · {total} cr
          </span>
        </h3>

        {selected.length === 0 ? (
          <p className="py-3 text-center text-xs text-gray-400">
            Tick courses in the Offered column to build your plan.
          </p>
        ) : (
          <>
            <ul className="mt-2 space-y-1">
              {selected.map((c) => (
                <li key={c.courseId} className="flex items-center gap-2 text-sm">
                  <span
                    className={`w-[4.5rem] shrink-0 rounded px-1.5 py-0.5 text-center font-mono text-xs font-bold ${
                      c.eligible ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {c.courseCode}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-gray-700">{c.title}</span>
                  <span className="shrink-0 text-xs text-gray-400">{c.creditHours} cr</span>
                </li>
              ))}
            </ul>

            {blocked.length > 0 && (
              <ul className="mt-2 space-y-1">
                {blocked.map((c) => (
                  <li key={c.courseId} className="text-xs text-red-600">
                    ⚠ {c.courseCode} is blocked — needs{' '}
                    {c.missingPrerequisites.map((p) => p.courseCode).join(', ')}
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={download}
              className="mt-3 w-full rounded-lg bg-sfbu-navy py-2 text-xs font-medium text-white hover:opacity-90"
            >
              ⬇ Download as PDF
            </button>
            <p className="mt-1 text-center text-[11px] text-gray-400">
              Opens your browser&rsquo;s print dialog — choose &ldquo;Save as PDF&rdquo;.
            </p>
          </>
        )}
      </div>

      {/* ── Printable sheet: hidden on screen, the only thing that reaches paper ── */}
      <div className="plan-print">
        <h1 style={{ fontSize: '18pt', fontWeight: 700, marginBottom: '2pt' }}>
          {termName ?? 'Semester'} Registration Plan
        </h1>
        <p style={{ fontSize: '10pt', marginBottom: '12pt' }}>
          SFBU ECE Program Explorer
          {programLabel ? ` · ${programLabel}` : ''}
          {printedOn ? ` · Printed ${printedOn}` : ''}
        </p>

        <h2 style={{ fontSize: '12pt', fontWeight: 700, marginBottom: '4pt' }}>
          Planned courses ({selected.length}) — {total} credits
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #000', padding: '3pt 0' }}>
                Code
              </th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #000', padding: '3pt 0' }}>
                Title
              </th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #000', padding: '3pt 0' }}>
                Credits
              </th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #000', padding: '3pt 0' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {selected.map((c) => (
              <tr key={c.courseId}>
                <td style={{ padding: '3pt 0' }}>{c.courseCode}</td>
                <td style={{ padding: '3pt 0' }}>{c.title}</td>
                <td style={{ textAlign: 'right', padding: '3pt 0' }}>{c.creditHours}</td>
                <td style={{ padding: '3pt 0' }}>
                  {c.eligible
                    ? 'Ready'
                    : `Blocked — needs ${c.missingPrerequisites.map((p) => p.courseCode).join(', ')}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {completedCodes.length > 0 && (
          <>
            <h2 style={{ fontSize: '12pt', fontWeight: 700, margin: '12pt 0 4pt' }}>
              Completed courses ({completedCodes.length})
            </h2>
            <p style={{ fontSize: '10pt' }}>{completedCodes.join(', ')}</p>
          </>
        )}

        <p style={{ fontSize: '9pt', marginTop: '14pt' }}>
          Advisory only. This plan is not a registration record — confirm with your academic advisor
          before enrolling.
        </p>
      </div>
    </div>
  );
}
