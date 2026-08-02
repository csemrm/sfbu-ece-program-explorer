'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, type Course, type PlanEvaluation, type TermSummary } from '../../lib/api';
import { CompletedPanel } from './CompletedPanel';
import { OfferedCourseRow } from './OfferedCourseRow';

interface Props {
  courses: Course[];
  academicTerms: TermSummary[];
}

interface PlanState {
  completedIds: string[];
  termId: string | null;
  selectedIds: string[];
}

const STORAGE_KEY = 'semester-plan-v3';
/** v1 stored `string[][]` terms, v2 `{courseIds, termId}[]`. Only completed courses carry over. */
const LEGACY_KEYS = ['semester-plan-v2', 'semester-plan-v1'];

const toIdArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

function loadState(): PlanState {
  const empty: PlanState = { completedIds: [], termId: null, selectedIds: [] };
  if (typeof window === 'undefined') return empty;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PlanState>;
      return {
        completedIds: toIdArray(parsed.completedIds),
        termId: typeof parsed.termId === 'string' ? parsed.termId : null,
        selectedIds: toIdArray(parsed.selectedIds),
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
 * Two-column planner: completed courses on the left, next semester's actual
 * offerings on the right.
 *
 * The right column is scoped to what the term genuinely offers rather than the
 * whole catalog, because the question it answers is "what can I register for
 * next semester" — a catalog-wide search would surface courses that aren't
 * running.
 */
export function OfferingPlanner({ courses, academicTerms }: Props) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [termId, setTermId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [evaluation, setEvaluation] = useState<PlanEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Prefer a term that actually has a published schedule.
  const defaultTermId = useMemo(
    () => academicTerms.find((t) => t.courseCount > 0)?.id ?? academicTerms[0]?.id ?? null,
    [academicTerms],
  );

  useEffect(() => {
    const s = loadState();
    setCompletedIds(s.completedIds);
    setSelectedIds(s.selectedIds);
    setTermId(s.termId ?? defaultTermId);
    setHydrated(true);
  }, [defaultTermId]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ completedIds, termId, selectedIds }),
    );
  }, [completedIds, termId, selectedIds, hydrated]);

  const term = academicTerms.find((t) => t.id === termId) ?? null;

  // Every offered course is evaluated, not just the selected ones, so the
  // column can show what is blocked *before* the user commits to it.
  const offeredIds = useMemo(() => {
    if (!term) return [];
    const known = new Set(courses.map((c) => c.id));
    return term.offeredCourseIds.filter((id) => known.has(id));
  }, [term, courses]);

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
  }, [completedIds, termId, offeredIds, hydrated]);

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
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      ),
    [],
  );

  const evaluated = evaluation?.terms[0]?.courses ?? [];
  const selectedSet = new Set(selectedIds);
  const selected = evaluated.filter((c) => selectedSet.has(c.courseId));
  const selectedCredits =
    Math.round(selected.reduce((sum, c) => sum + c.creditHours, 0) * 10) / 10;
  const blockedSelected = selected.filter((c) => !c.eligible).length;

  const coreqsNotSelected = (courseId: string): string[] => {
    const c = evaluated.find((e) => e.courseId === courseId);
    if (!c) return [];
    return c.corequisites
      .filter((co) => co.status !== 'completed' && !selectedSet.has(co.id))
      .map((co) => co.courseCode);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
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
              {t.courseCount === 0 ? ' — schedule not published yet' : ` (${t.courseCount} courses)`}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Left: what you have already done ── */}
        <div className="space-y-4">
          <CompletedPanel
            courses={courses}
            completedIds={completedIds}
            onAdd={addCompleted}
            onRemove={removeCompleted}
            onClear={() => setCompletedIds([])}
          />
        </div>

        {/* ── Right: what is actually on offer ── */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-800">
              {term ? `Offered in ${term.name}` : 'Next semester'}
            </h2>
            <p className="text-xs text-gray-400">
              {offeredIds.length > 0
                ? `${offeredIds.length} course${offeredIds.length !== 1 ? 's' : ''} · ${selectedIds.length} selected · ${selectedCredits} cr`
                : 'Select the courses you plan to register for.'}
            </p>
          </div>

          <div className="px-4 py-3">
            {!term ? (
              <p className="py-6 text-center text-sm text-gray-400">
                No academic terms have been set up yet.
              </p>
            ) : offeredIds.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                The schedule for {term.name} hasn&rsquo;t been published yet.
              </p>
            ) : evaluated.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">Checking eligibility…</p>
            ) : (
              <ul className="space-y-2">
                {evaluated.map((c) => (
                  <OfferedCourseRow
                    key={c.courseId}
                    course={c}
                    selected={selectedSet.has(c.courseId)}
                    onToggle={() => toggleSelected(c.courseId)}
                    unselectedCorequisites={coreqsNotSelected(c.courseId)}
                  />
                ))}
              </ul>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-3">
              <p
                className={`rounded-lg px-3 py-2 text-xs font-medium ${
                  blockedSelected > 0
                    ? 'bg-red-50 text-red-700'
                    : 'bg-green-50 text-green-700'
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
      </div>
    </div>
  );
}
