'use client';

import { useMemo, useState } from 'react';
import type { EvaluatedCourse } from '../../lib/api';
import { tierRank, type RequirementTier } from '../../lib/programScope';

interface Props {
  termName: string | null;
  programLabel: string | null;
  /** Offered courses that are registrable now and not yet chosen. */
  recommended: EvaluatedCourse[];
  /** Offered courses the user has ticked. */
  selected: EvaluatedCourse[];
  /** Every offered course in the term, for the printed sheet. */
  offered: EvaluatedCourse[];
  completedCodes: string[];
  /** Requirement group per course id, for grouping the plan. */
  groups?: Record<string, string>;
  /** Requirement tier per course id, for ordering those groups. */
  tiers?: Record<string, RequirementTier>;
  /** The group's position in the catalog sequence, per course id. */
  groupOrder?: Record<string, number>;
  onAdd: (courseId: string) => void;
}

const TABLE = { width: '100%', borderCollapse: 'collapse' as const, fontSize: '10pt' };
const TH = { textAlign: 'left' as const, borderBottom: '1px solid #000', padding: '3pt 0' };
const TD = { padding: '3pt 0' };

/** "1 credit", not "1 credits" — it is printed and handed to an advisor. */
const creditLabel = (n: number) => `${n} credit${n === 1 ? '' : 's'}`;

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
  offered,
  completedCodes,
  groups,
  tiers,
  groupOrder,
  onAdd,
}: Props) {
  const [printedOn, setPrintedOn] = useState<string | null>(null);

  const blocked = selected.filter((c) => !c.eligible);
  const total = credits(selected);

  /**
   * The plan split by requirement group, strongest obligation first.
   *
   * A flat list of five codes does not tell a student whether they have covered
   * their core requirements or stacked five electives — which is the question a
   * registration plan exists to answer.
   */
  const grouped = useMemo(() => {
    const byGroup = new Map<string, EvaluatedCourse[]>();
    for (const course of selected) {
      const name = groups?.[course.courseId] ?? 'Not in this degree';
      const list = byGroup.get(name);
      if (list) list.push(course);
      else byGroup.set(name, [course]);
    }
    return [...byGroup.entries()]
      .map(([name, courses]) => ({
        name,
        courses,
        rank: tierRank(tiers?.[courses[0].courseId]),
        // Within a tier, follow the catalog's own sequence — Foundation before
        // Capstone, not alphabetically the other way round.
        order: groupOrder?.[courses[0].courseId] ?? Number.MAX_SAFE_INTEGER,
      }))
      .sort((a, b) => a.rank - b.rank || a.order - b.order || a.name.localeCompare(b.name));
  }, [selected, groups, tiers, groupOrder]);

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
            {grouped.map((group) => (
              <div key={group.name} className="mt-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {group.name}
                  <span className="ml-1.5 font-normal normal-case tracking-normal">
                    {credits(group.courses)} cr
                  </span>
                </p>
                <ul className="mt-1 space-y-1">
                  {group.courses.map((c) => (
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
              </div>
            ))}

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
          Planned courses ({selected.length}) — {creditLabel(total)}
        </h2>
        {grouped.map((group) => (
          <div key={group.name} style={{ marginBottom: '8pt' }}>
            <h3 style={{ fontSize: '10pt', fontWeight: 700, margin: '0 0 2pt' }}>
              {group.name} — {creditLabel(credits(group.courses))}
            </h3>
            <table style={TABLE}>
              <thead>
                <tr>
                  <th style={TH}>Code</th>
                  <th style={TH}>Title</th>
                  <th style={{ ...TH, textAlign: 'right' }}>Credits</th>
                  <th style={TH}>Status</th>
                </tr>
              </thead>
              <tbody>
                {group.courses.map((c) => (
                  <tr key={c.courseId}>
                    <td style={TD}>{c.courseCode}</td>
                    <td style={TD}>{c.title}</td>
                    <td style={{ ...TD, textAlign: 'right' }}>{c.creditHours}</td>
                    <td style={TD}>
                      {c.eligible
                        ? 'Ready'
                        : `Blocked — needs ${c.missingPrerequisites.map((p) => p.courseCode).join(', ')}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {recommended.length > 0 && (
          <>
            <h2 style={{ fontSize: '12pt', fontWeight: 700, margin: '12pt 0 4pt' }}>
              Ready to register ({recommended.length})
            </h2>
            <p style={{ fontSize: '10pt' }}>
              {recommended.map((c) => `${c.courseCode} ${c.title}`).join(' · ')}
            </p>
          </>
        )}

        {offered.length > 0 && (
          <>
            <h2 style={{ fontSize: '12pt', fontWeight: 700, margin: '12pt 0 4pt' }}>
              Offered in {termName ?? 'this term'} ({offered.length})
            </h2>
            <table style={TABLE}>
              <thead>
                <tr>
                  <th style={TH}>Code</th>
                  <th style={TH}>Title</th>
                  <th style={{ ...TH, textAlign: 'right' }}>Credits</th>
                  <th style={TH}>Registration</th>
                </tr>
              </thead>
              <tbody>
                {offered.map((c) => (
                  <tr key={c.courseId}>
                    <td style={TD}>{c.courseCode}</td>
                    <td style={TD}>{c.title}</td>
                    <td style={{ ...TD, textAlign: 'right' }}>{c.creditHours}</td>
                    <td style={TD}>
                      {c.openForRegistration === false
                        ? (c.statusNote ?? 'Closed')
                        : c.eligible
                          ? 'Open'
                          : 'Open — prerequisites pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

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
