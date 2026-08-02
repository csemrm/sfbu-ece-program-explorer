'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api, type Course, type PlanEvaluation, type TermSummary } from '../../lib/api';
import { CompletedPanel } from './CompletedPanel';
import { TermCard } from './TermCard';
import { SuggestionsPanel } from './SuggestionsPanel';

interface Props {
  courses: Course[];
  /** Curated academic terms; empty when an admin hasn't set any up yet. */
  academicTerms?: TermSummary[];
}

/** A planned semester. `termId` is null while the slot stays offering-agnostic. */
interface PlannedTerm {
  courseIds: string[];
  termId: string | null;
}

interface PlanState {
  completedIds: string[];
  terms: PlannedTerm[];
}

const STORAGE_KEY = 'semester-plan-v2';
const LEGACY_STORAGE_KEY = 'semester-plan-v1';
const EMPTY: PlanState = { completedIds: [], terms: [{ courseIds: [], termId: null }] };

const toIdArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

/**
 * v1 stored terms as `string[][]`; v2 stores objects so a slot can bind to an
 * academic term. Read v2 first, then migrate a v1 plan rather than discarding
 * someone's saved work.
 */
function loadState(): PlanState {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PlanState>;
      const terms = Array.isArray(parsed.terms)
        ? parsed.terms.map((t) => ({
            courseIds: toIdArray(t?.courseIds),
            termId: typeof t?.termId === 'string' ? t.termId : null,
          }))
        : [];
      return {
        completedIds: toIdArray(parsed.completedIds),
        terms: terms.length > 0 ? terms : EMPTY.terms,
      };
    }

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacy) return EMPTY;
    const parsed = JSON.parse(legacy) as { completedIds?: unknown; terms?: unknown };
    const terms = Array.isArray(parsed.terms)
      ? parsed.terms.map((t) => ({ courseIds: toIdArray(t), termId: null }))
      : [];
    return {
      completedIds: toIdArray(parsed.completedIds),
      terms: terms.length > 0 ? terms : EMPTY.terms,
    };
  } catch {
    return EMPTY;
  }
}

export function SemesterPlanner({ courses, academicTerms = [] }: Props) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [terms, setTerms] = useState<PlannedTerm[]>(EMPTY.terms);
  const [evaluation, setEvaluation] = useState<PlanEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client-only).
  useEffect(() => {
    const s = loadState();
    setCompletedIds(s.completedIds);
    setTerms(s.terms);
    setHydrated(true);
  }, []);

  // Persist whenever the plan changes.
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedIds, terms }));
  }, [completedIds, terms, hydrated]);

  // Re-evaluate (debounced) whenever the plan changes.
  const reqId = useRef(0);
  useEffect(() => {
    if (!hydrated) return;
    const id = ++reqId.current;
    const timer = setTimeout(() => {
      api.planner
        .evaluate({
          completedCourseIds: completedIds,
          // Omit termId entirely when unbound — the API treats a missing
          // termId as "no availability check", not as an unknown term.
          terms: terms.map((t) => ({
            courseIds: t.courseIds,
            ...(t.termId ? { termId: t.termId } : {}),
          })),
        })
        .then((result) => {
          if (id === reqId.current) {
            setEvaluation(result);
            setError(null);
          }
        })
        .catch((e: unknown) => {
          if (id === reqId.current) {
            setError(e instanceof Error ? e.message : 'Failed to evaluate plan.');
          }
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [completedIds, terms, hydrated]);

  const addCompleted = useCallback(
    (id: string) => setCompletedIds((prev) => (prev.includes(id) ? prev : [...prev, id])),
    [],
  );
  const removeCompleted = useCallback(
    (id: string) => setCompletedIds((prev) => prev.filter((x) => x !== id)),
    [],
  );

  const addToTerm = useCallback(
    (termIndex: number, id: string) =>
      setTerms((prev) =>
        prev.map((t, i) =>
          i === termIndex && !t.courseIds.includes(id)
            ? { ...t, courseIds: [...t.courseIds, id] }
            : t,
        ),
      ),
    [],
  );
  const removeFromTerm = useCallback(
    (termIndex: number, id: string) =>
      setTerms((prev) =>
        prev.map((t, i) =>
          i === termIndex ? { ...t, courseIds: t.courseIds.filter((x) => x !== id) } : t,
        ),
      ),
    [],
  );
  const setTermId = useCallback(
    (termIndex: number, termId: string | null) =>
      setTerms((prev) => prev.map((t, i) => (i === termIndex ? { ...t, termId } : t))),
    [],
  );
  const addTerm = useCallback(
    () => setTerms((prev) => [...prev, { courseIds: [], termId: null }]),
    [],
  );
  const removeTerm = useCallback(
    (termIndex: number) =>
      setTerms((prev) => {
        const next = prev.filter((_, i) => i !== termIndex);
        return next.length > 0 ? next : [{ courseIds: [], termId: null }];
      }),
    [],
  );

  const resetAll = useCallback(() => {
    setCompletedIds([]);
    setTerms([{ courseIds: [], termId: null }]);
  }, []);

  // "Add suggestion" drops the course into the last term.
  const addSuggestionToLastTerm = useCallback(
    (id: string) => addToTerm(terms.length - 1, id),
    [addToTerm, terms.length],
  );

  const plannedCount = terms.reduce((n, t) => n + t.courseIds.length, 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <CompletedPanel
          courses={courses}
          completedIds={completedIds}
          onAdd={addCompleted}
          onRemove={removeCompleted}
          onClear={() => setCompletedIds([])}
        />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {terms.map((t, i) => (
            <TermCard
              key={i}
              index={i}
              courseIds={t.courseIds}
              courses={courses}
              evaluation={evaluation?.terms[i]}
              academicTerms={academicTerms}
              termId={t.termId}
              onChangeTerm={(termId) => setTermId(i, termId)}
              onAddCourse={(id) => addToTerm(i, id)}
              onRemoveCourse={(id) => removeFromTerm(i, id)}
              onRemoveTerm={() => removeTerm(i)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addTerm}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-sfbu-navy hover:text-sfbu-navy"
        >
          + Add another semester
        </button>
      </div>

      <aside className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800">Plan summary</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Completed</dt>
              <dd className="font-medium text-gray-800">{completedIds.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Semesters</dt>
              <dd className="font-medium text-gray-800">{terms.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Planned courses</dt>
              <dd className="font-medium text-gray-800">{plannedCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Planned credits</dt>
              <dd className="font-medium text-gray-800">{evaluation?.totalPlannedCredits ?? 0}</dd>
            </div>
          </dl>
          {evaluation && plannedCount > 0 && (
            <p
              className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium ${
                !evaluation.allEligible
                  ? 'bg-red-50 text-red-600'
                  : !evaluation.allOffered
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-green-50 text-green-700'
              }`}
            >
              {!evaluation.allEligible
                ? 'Some courses are blocked — check the details.'
                : !evaluation.allOffered
                  ? 'Prerequisites all check out, but some courses are not offered in the term you picked.'
                  : 'All planned courses are eligible. ✓'}
            </p>
          )}
          {(completedIds.length > 0 || plannedCount > 0) && (
            <button
              type="button"
              onClick={resetAll}
              className="mt-3 w-full rounded-lg border border-gray-200 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-red-500"
            >
              Reset plan
            </button>
          )}
        </div>

        <SuggestionsPanel
          suggestions={evaluation?.suggestions ?? []}
          onAdd={addSuggestionToLastTerm}
        />
      </aside>
    </div>
  );
}
