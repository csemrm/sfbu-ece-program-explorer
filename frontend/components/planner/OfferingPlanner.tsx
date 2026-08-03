'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  api,
  type Course,
  type OfferedCourse,
  type PlanEvaluation,
  type TermSummary,
} from '../../lib/api';
import { groupColor, scopeFor, tierRank, type ProgramOption } from '../../lib/programScope';
import { CompletedPanel } from './CompletedPanel';
import { OfferedCourseRow } from './OfferedCourseRow';
import { PlanSummaryColumn } from './PlanSummaryColumn';

interface Props {
  courses: Course[];
  academicTerms: TermSummary[];
  programs: ProgramOption[];
  /**
   * Degree to open on, from `?program=` — set when the planner is linked from a
   * program page. Takes precedence over the stored plan, because arriving from
   * BSCS and landing on MSCS would be the wrong answer to a deliberate click.
   */
  initialProgramId?: string | null;
}

interface PlanState {
  completedIds: string[];
  termId: string | null;
  selectedIds: string[];
  programId: string | null;
  /**
   * Whether the user chose to see offerings outside their degree.
   *
   * Persisted because it is not a transient view toggle: a plan built through
   * the escape hatch is made of out-of-scope courses, so losing the flag on
   * reload empties "Your plan" and hides the PDF button while the selections
   * themselves are still stored — the plan looks discarded when it is not.
   */
  showAllOfferings: boolean;
}

const STORAGE_KEY = 'semester-plan-v3';
/** The Suggested column is a shortlist, not a second copy of the schedule. */
const MAX_RECOMMENDATIONS = 5;
/** Heading for offerings the selected degree has no requirement group for. */
const OUTSIDE_DEGREE = 'Not part of this degree';
/** v1 stored `string[][]` terms, v2 `{courseIds, termId}[]`. Only completed courses carry over. */
const LEGACY_KEYS = ['semester-plan-v2', 'semester-plan-v1'];

const toIdArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

const toId = (value: unknown): string | null => (typeof value === 'string' ? value : null);

function loadState(): PlanState {
  const empty: PlanState = {
    completedIds: [],
    termId: null,
    selectedIds: [],
    programId: null,
    showAllOfferings: false,
  };
  if (typeof window === 'undefined') return empty;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PlanState>;
      // programId and showAllOfferings were added after v3 shipped; an older v3
      // plan simply has neither and falls back to the defaults, so no storage
      // bump is needed.
      return {
        completedIds: toIdArray(parsed.completedIds),
        termId: toId(parsed.termId),
        selectedIds: toIdArray(parsed.selectedIds),
        programId: toId(parsed.programId),
        showAllOfferings: parsed.showAllOfferings === true,
      };
    }
    // Salvage the completed list from an older plan rather than dropping it —
    // it is the part a user actually invested effort in.
    for (const key of LEGACY_KEYS) {
      const legacy = window.localStorage.getItem(key);
      if (!legacy) continue;
      const parsed = JSON.parse(legacy) as { completedIds?: unknown };
      return { ...empty, completedIds: toIdArray(parsed.completedIds) };
    }
    return empty;
  } catch {
    return empty;
  }
}

/**
 * Three-column planner: completed courses, the term's actual offerings, and
 * the resulting plan.
 *
 * A degree is chosen first and scopes both catalog columns, because a BSCS
 * student has no use for the MSEE catalog. Scoping the offerings can empty
 * that column outright — Fall 2026, for instance, runs graduate CS only — so
 * the gap is stated in words and an escape hatch shows the unscoped term
 * rather than leaving a blank panel that reads as a bug.
 */
export function OfferingPlanner({
  courses,
  academicTerms,
  programs,
  initialProgramId = null,
}: Props) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [termId, setTermId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [programId, setProgramId] = useState<string | null>(null);
  const [showAllOfferings, setShowAllOfferings] = useState(false);
  const [offeredQuery, setOfferedQuery] = useState('');
  const [evaluation, setEvaluation] = useState<PlanEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Prefer a term that actually has a published schedule.
  const defaultTermId = useMemo(
    () => academicTerms.find((t) => t.courseCount > 0)?.id ?? academicTerms[0]?.id ?? null,
    [academicTerms],
  );
  const defaultProgramId = programs[0]?.id ?? null;

  useEffect(() => {
    const s = loadState();
    setCompletedIds(s.completedIds);
    setSelectedIds(s.selectedIds);
    // A stored term that no longer exists falls back to the default rather than
    // being restored blindly. Without this the selector showed a real term while
    // the column beside it read "No academic terms have been set up yet" — the
    // id had survived a term being deleted, or the database being replaced.
    setTermId(s.termId && academicTerms.some((t) => t.id === s.termId) ? s.termId : defaultTermId);
    const known = (id: string | null) => !!id && programs.some((p) => p.id === id);
    setProgramId(
      known(initialProgramId)
        ? initialProgramId
        : known(s.programId)
          ? s.programId
          : defaultProgramId,
    );
    setShowAllOfferings(s.showAllOfferings);
    setHydrated(true);
  }, [defaultTermId, defaultProgramId, programs, academicTerms, initialProgramId]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ completedIds, termId, selectedIds, programId, showAllOfferings }),
    );
  }, [completedIds, termId, selectedIds, programId, showAllOfferings, hydrated]);

  const term = academicTerms.find((t) => t.id === termId) ?? null;
  const program = programs.find((p) => p.id === programId) ?? null;

  /**
   * Arriving from a program page means the degree is already decided, so it is
   * shown rather than offered as a choice — a selector there invites the user
   * to undo the navigation they just made. It is still named, because the rest
   * of the screen is scoped to it and that must not be invisible.
   */
  const degreeFixed = !!initialProgramId && programs.some((p) => p.id === initialProgramId);
  // Still used for the completed-courses column, which lists the whole degree
  // rather than one term's offerings.
  const scope = useMemo(() => scopeFor(program), [program]);

  /** The catalog narrowed to the chosen degree. */
  const scopedCourses = useMemo(
    () => (scope ? courses.filter((c) => scope.has(c.id)) : courses),
    [courses, scope],
  );

  /**
   * The term's offerings, read from the database for this degree and semester
   * rather than derived in the browser.
   *
   * The API returns the whole term with each course flagged `inProgram`, so the
   * "N of M are outside <degree>" notice and its escape hatch still work from a
   * single request.
   */
  const [offerings, setOfferings] = useState<OfferedCourse[]>([]);
  useEffect(() => {
    if (!hydrated || !termId) {
      setOfferings([]);
      return;
    }
    let current = true;
    api.terms
      .get(termId, programId ? { programId } : undefined)
      .then((detail) => {
        if (current) setOfferings(detail.courses);
      })
      .catch(() => {
        if (current) setOfferings([]);
      });
    return () => {
      current = false;
    };
  }, [termId, programId, hydrated]);

  // Every offered course is evaluated, not just the selected ones, so the
  // column can show what is blocked *before* the user commits to it.
  //
  // Ordered by what the student can act on: anything closed or cancelled sinks
  // to the end regardless of degree, because it cannot be registered for at
  // all; among the rest the degree's own courses lead, so revealing the whole
  // term does not bury them.
  //
  // Sorted once, before the split — sorting only the full list left the default
  // scoped view in whatever order the API returned.
  const sortedOfferings = useMemo(
    () =>
      [...offerings].sort(
        (a, b) =>
          Number(b.openForRegistration) - Number(a.openForRegistration) ||
          Number(b.inProgram) - Number(a.inProgram) ||
          a.courseCode.localeCompare(b.courseCode),
      ),
    [offerings],
  );

  const termOfferedIds = useMemo(() => sortedOfferings.map((o) => o.id), [sortedOfferings]);

  const inScopeOfferedIds = useMemo(
    () => sortedOfferings.filter((o) => o.inProgram).map((o) => o.id),
    [sortedOfferings],
  );

  const hiddenByDegree = termOfferedIds.length - inScopeOfferedIds.length;
  const offeredIds = showAllOfferings ? termOfferedIds : inScopeOfferedIds;

  const reqId = useRef(0);
  useEffect(() => {
    if (!hydrated) return;
    if (!termId || offeredIds.length === 0) {
      setEvaluation(null);
      return;
    }
    const id = ++reqId.current;
    const timer = setTimeout(() => {
      api.planner
        .evaluate({
          completedCourseIds: completedIds,
          terms: [{ termId, courseIds: offeredIds }],
          // Scopes prerequisites to the chosen degree, so an MSCS student is not
          // blocked on undergraduate BSCS courses their admission already covered.
          ...(programId ? { programId } : {}),
        })
        .then((result) => {
          if (id === reqId.current) {
            setEvaluation(result);
            setError(null);
          }
        })
        .catch((e: unknown) => {
          if (id === reqId.current) {
            setError(e instanceof Error ? e.message : 'Failed to evaluate eligibility.');
          }
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [completedIds, termId, offeredIds, programId, hydrated]);

  const addCompleted = useCallback(
    (id: string) => setCompletedIds((prev) => (prev.includes(id) ? prev : [...prev, id])),
    [],
  );
  const removeCompleted = useCallback(
    (id: string) => setCompletedIds((prev) => prev.filter((x) => x !== id)),
    [],
  );
  const toggleSelected = useCallback(
    (id: string) =>
      setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [],
  );
  const addSelected = useCallback(
    (id: string) => setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id])),
    [],
  );

  /**
   * Courses already marked completed are dropped from the offerings column.
   *
   * The column answers "what can I register for next semester", and something
   * already passed is not a candidate — leaving it in was noise the student had
   * to filter out by hand on every render.
   */
  const evaluated = (evaluation?.terms[0]?.courses ?? []).filter((c) => !c.alreadyCompleted);
  const completedHiddenCount = (evaluation?.terms[0]?.courses.length ?? 0) - evaluated.length;

  /** The offerings column after its own filter — the term is long enough to need one. */
  const visibleOffered = useMemo(() => {
    const q = offeredQuery.trim().toLowerCase();
    if (q === '') return evaluated;
    return evaluated.filter(
      (c) => c.courseCode.toLowerCase().includes(q) || c.title.toLowerCase().includes(q),
    );
  }, [evaluated, offeredQuery]);

  /**
   * The offerings split into one card per requirement group.
   *
   * Cards follow the catalog's own sequence — Foundation before Capstone —
   * rather than the alphabet. Courses the selected degree has no group for come
   * last under one heading; that set is only non-empty once the escape hatch
   * reveals the rest of the term.
   */
  const offeredGroups = useMemo(() => {
    const buckets = new Map<
      string,
      { name: string; order: number; courses: typeof visibleOffered }
    >();
    for (const course of visibleOffered) {
      const name = program?.groups[course.courseId] ?? OUTSIDE_DEGREE;
      const order = program?.groupOrder[course.courseId] ?? Number.MAX_SAFE_INTEGER;
      const bucket = buckets.get(name);
      if (bucket) bucket.courses.push(course);
      else buckets.set(name, { name, order, courses: [course] });
    }
    return [...buckets.values()].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }, [visibleOffered, program]);
  const selectedSet = new Set(selectedIds);
  const selected = evaluated.filter((c) => selectedSet.has(c.courseId));
  const selectedCredits = Math.round(selected.reduce((sum, c) => sum + c.creditHours, 0) * 10) / 10;
  const blockedSelected = selected.filter((c) => !c.eligible).length;

  /**
   * Offered, registrable now, and not already chosen — capped at five.
   *
   * A recommendation list as long as the term's schedule is not a
   * recommendation. Five is enough to fill a semester and short enough to read
   * without scrolling; the full list is the Offered column beside it.
   */
  /**
   * Capstone courses the student is not yet ready for.
   *
   * The catalog reserves the capstone for "all or most coursework" completed, so
   * it is offered once this semester would carry the student to the degree's
   * required credits. Below that it is flagged with the shortfall rather than
   * blocked: "most" is a judgement an advisor makes, and the planner does not
   * hold that authority — the same reason an unmet prerequisite stays
   * selectable.
   */
  const capstoneShortfall = useMemo(() => {
    const required = program?.requiredCredits ?? 0;
    const capstones = new Set(program?.capstoneCourseIds ?? []);
    if (!required || capstones.size === 0) return new Map<string, number>();

    const creditsOf = new Map(courses.map((c) => [c.id, Number(c.creditHours) || 0]));
    const completedCredits = completedIds.reduce((sum, id) => sum + (creditsOf.get(id) ?? 0), 0);
    const plannedCredits = selectedIds.reduce((sum, id) => sum + (creditsOf.get(id) ?? 0), 0);

    const shortfall = new Map<string, number>();
    for (const id of capstones) {
      const withCapstone =
        completedCredits +
        plannedCredits +
        (selectedIds.includes(id) ? 0 : (creditsOf.get(id) ?? 0));
      const gap = Math.round((required - withCapstone) * 10) / 10;
      if (gap > 0) shortfall.set(id, gap);
    }
    return shortfall;
  }, [program, courses, completedIds, selectedIds]);

  /**
   * How many other offered courses each course would unlock.
   *
   * Built from what the term itself reports as blocked: a course named in
   * another's missing prerequisites is a gateway into the rest of the schedule.
   */
  const unlockCount = useMemo(() => {
    const counts = new Map<string, number>();
    for (const course of evaluated) {
      for (const missing of course.missingPrerequisites) {
        counts.set(missing.id, (counts.get(missing.id) ?? 0) + 1);
      }
    }
    return counts;
  }, [evaluated]);

  const recommended = evaluated
    .filter(
      (c) =>
        c.registrable &&
        !c.alreadyCompleted &&
        !selectedSet.has(c.courseId) &&
        // Recommending a capstone to a student who is not near the end would be
        // advice they cannot act on.
        !capstoneShortfall.has(c.courseId),
    )
    // Ranked by how firmly the degree requires the course: a Core or Foundation
    // course outranks a specialization choice, which outranks a free elective.
    // With only five slots, spending one on an elective while a required course
    // is available would be the wrong advice.
    // Requirement tier first, then how much each course unlocks. A student with
    // nothing completed therefore sees the entry points to their degree — the
    // required courses that gate the most of the rest.
    //
    // Unlocks are deliberately not the leading key: ranked on unlock count
    // alone, FIN501 led the MSCS and MSDS lists because it gates two business
    // electives, ahead of the Foundation courses those degrees actually start
    // with. Gating many courses is only useful advice among courses the student
    // is otherwise required to take.
    .sort(
      (a, b) =>
        tierRank(program?.tiers[a.courseId]) - tierRank(program?.tiers[b.courseId]) ||
        (unlockCount.get(b.courseId) ?? 0) - (unlockCount.get(a.courseId) ?? 0) ||
        a.courseCode.localeCompare(b.courseCode),
    )
    .slice(0, MAX_RECOMMENDATIONS);

  const completedCodes = useMemo(() => {
    const byId = new Map(courses.map((c) => [c.id, c]));
    return completedIds.map((id) => byId.get(id)?.courseCode).filter((c): c is string => !!c);
  }, [completedIds, courses]);

  const coreqsNotSelected = (courseId: string): string[] => {
    const c = evaluated.find((e) => e.courseId === courseId);
    if (!c) return [];
    return c.corequisites
      .filter((co) => co.status !== 'completed' && !selectedSet.has(co.id))
      .map((co) => co.courseCode);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {programs.length > 0 &&
          (degreeFixed ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Degree</span>
              <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-800">
                {program ? `${program.abbreviation} — ${program.name}` : '—'}
              </span>
              <Link
                href={`/programs/${programId}`}
                className="text-xs text-gray-400 underline hover:text-sfbu-navy"
              >
                back to programme
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <label htmlFor="planner-program" className="text-sm font-medium text-gray-600">
                Degree
              </label>
              <select
                id="planner-program"
                value={programId ?? ''}
                onChange={(e) => {
                  setProgramId(e.target.value || null);
                  setShowAllOfferings(false);
                }}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:border-sfbu-navy focus:outline-none"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.abbreviation} — {p.name}
                  </option>
                ))}
              </select>
            </div>
          ))}

        <div className="flex items-center gap-3">
          <label htmlFor="planner-term" className="text-sm font-medium text-gray-600">
            Next semester
          </label>
          <select
            id="planner-term"
            value={termId ?? ''}
            onChange={(e) => setTermId(e.target.value || null)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:border-sfbu-navy focus:outline-none"
          >
            {academicTerms.length === 0 && <option value="">No terms available</option>}
            {academicTerms.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
                {t.courseCount === 0
                  ? ' — schedule not published yet'
                  : ` (${t.courseCount} courses)`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Left: what you have already done ── */}
        <div className="space-y-4">
          <CompletedPanel
            courses={scopedCourses}
            allCourses={courses}
            degreeLabel={program?.abbreviation ?? null}
            completedIds={completedIds}
            onAdd={addCompleted}
            onRemove={removeCompleted}
            onClear={() => setCompletedIds([])}
          />
        </div>

        {/* ── Middle: what is actually on offer ── */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-800">
              {term ? `Offered in ${term.name}` : 'Next semester'}
            </h2>
            <p className="text-xs text-gray-400">
              {offeredIds.length > 0
                ? `${evaluated.length} course${evaluated.length !== 1 ? 's' : ''} · ${selectedIds.length} selected · ${selectedCredits} cr` +
                  (completedHiddenCount > 0 ? ` · ${completedHiddenCount} completed hidden` : '')
                : 'Select the courses you plan to register for.'}
            </p>
          </div>

          {hiddenByDegree > 0 && program && (
            <div className="border-b border-gray-100 bg-amber-50 px-4 py-2.5">
              <p className="text-xs text-amber-800">
                {inScopeOfferedIds.length === 0
                  ? `None of ${term?.name ?? 'this term'}'s ${termOfferedIds.length} courses are part of ${program.abbreviation}.`
                  : `${hiddenByDegree} of ${termOfferedIds.length} offered courses are outside ${program.abbreviation}.`}
              </p>
              <button
                type="button"
                onClick={() => setShowAllOfferings((v) => !v)}
                className="mt-1 text-xs font-medium text-amber-900 underline hover:no-underline"
              >
                {showAllOfferings
                  ? `Show only ${program.abbreviation} courses`
                  : `Show all ${termOfferedIds.length} anyway`}
              </button>
            </div>
          )}

          {offeredIds.length > 0 && (
            <div className="border-b border-gray-100 px-4 py-2.5">
              <input
                type="search"
                value={offeredQuery}
                onChange={(e) => setOfferedQuery(e.target.value)}
                placeholder="Filter offered courses…"
                aria-label="Filter offered courses by code or title"
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-sfbu-navy focus:outline-none focus:ring-1 focus:ring-sfbu-navy"
              />
            </div>
          )}

          <div className="px-4 py-3">
            {!term ? (
              <p className="py-6 text-center text-sm text-gray-400">
                No academic terms have been set up yet.
              </p>
            ) : termOfferedIds.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                The schedule for {term.name} hasn&rsquo;t been published yet.
              </p>
            ) : offeredIds.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                Nothing in {term.name} matches this degree.
              </p>
            ) : evaluated.length === 0 && completedHiddenCount > 0 ? (
              // Every offered course is already completed — a real state, and a
              // good one. Without this it would sit on "Checking eligibility…".
              <p className="py-6 text-center text-sm text-gray-400">
                You&rsquo;ve already completed everything offered in {term.name}.
              </p>
            ) : evaluated.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">Checking eligibility…</p>
            ) : (
              <ul className="space-y-2">
                {visibleOffered.length === 0 && (
                  <li className="py-4 text-center text-sm text-gray-400">
                    No offered courses match &ldquo;{offeredQuery.trim()}&rdquo;.
                  </li>
                )}
                {offeredGroups.map((group) => (
                  <li key={group.name}>
                    <section className="overflow-hidden rounded-xl border border-gray-200">
                      <h3
                        className={`flex items-center justify-between gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white ${groupColor(
                          group.order,
                        )}`}
                      >
                        <span className="truncate">{group.name}</span>
                        <span className="shrink-0 font-normal opacity-90">
                          {group.courses.length}
                        </span>
                      </h3>
                      <ul className="space-y-2 p-2">
                        {group.courses.map((c) => (
                          <OfferedCourseRow
                            key={c.courseId}
                            course={c}
                            selected={selectedSet.has(c.courseId)}
                            onToggle={() => toggleSelected(c.courseId)}
                            unselectedCorequisites={coreqsNotSelected(c.courseId)}
                            capstoneShortfall={capstoneShortfall.get(c.courseId) ?? null}
                          />
                        ))}
                      </ul>
                    </section>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3">
              <p
                className={`rounded-lg px-3 py-2 text-xs font-medium ${
                  blockedSelected > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}
              >
                {blockedSelected > 0
                  ? `${blockedSelected} of your ${selectedIds.length} selected course${selectedIds.length !== 1 ? 's' : ''} still ${blockedSelected === 1 ? 'has' : 'have'} pending prerequisites.`
                  : `All ${selectedIds.length} selected course${selectedIds.length !== 1 ? 's' : ''} are ready to register — ${selectedCredits} credits. ✓`}
              </p>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="mt-2 w-full rounded-lg border border-gray-200 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-red-500"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>

        {/* ── Right: what to take, and the sheet you print ── */}
        <PlanSummaryColumn
          termName={term?.name ?? null}
          programLabel={program ? `${program.abbreviation} — ${program.name}` : null}
          recommended={recommended}
          selected={selected}
          offered={evaluated}
          completedCodes={completedCodes}
          groups={program?.groups}
          tiers={program?.tiers}
          groupOrder={program?.groupOrder}
          onAdd={addSelected}
        />
      </div>
    </div>
  );
}
