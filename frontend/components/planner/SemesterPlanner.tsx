'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api, type Course, type PlanEvaluation } from '../../lib/api';
import { CompletedPanel } from './CompletedPanel';
import { TermCard } from './TermCard';
import { SuggestionsPanel } from './SuggestionsPanel';

interface Props {
  courses: Course[];
}

interface PlanState {
  completedIds: string[];
  terms: string[][];
}

const STORAGE_KEY = 'semester-plan-v1';
const EMPTY: PlanState = { completedIds: [], terms: [[]] };

function loadState(): PlanState {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<PlanState>;
    return {
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
      terms:
        Array.isArray(parsed.terms) && parsed.terms.length > 0
          ? parsed.terms.map((t) => (Array.isArray(t) ? t : []))
          : [[]],
    };
  } catch {
    return EMPTY;
  }
}

export function SemesterPlanner({ courses }: Props) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [terms, setTerms] = useState<string[][]>([[]]);
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
          terms: terms.map((courseIds) => ({ courseIds })),
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
      setTerms((prev) => prev.map((t, i) => (i === termIndex && !t.includes(id) ? [...t, id] : t))),
    [],
  );
  const removeFromTerm = useCallback(
    (termIndex: number, id: string) =>
      setTerms((prev) => prev.map((t, i) => (i === termIndex ? t.filter((x) => x !== id) : t))),
    [],
  );
  const addTerm = useCallback(() => setTerms((prev) => [...prev, []]), []);
  const removeTerm = useCallback(
    (termIndex: number) =>
      setTerms((prev) => {
        const next = prev.filter((_, i) => i !== termIndex);
        return next.length > 0 ? next : [[]];
      }),
    [],
  );

  const resetAll = useCallback(() => {
    setCompletedIds([]);
    setTerms([[]]);
  }, []);

  // "Add suggestion" drops the course into the last term.
  const addSuggestionToLastTerm = useCallback(
    (id: string) => addToTerm(terms.length - 1, id),
    [addToTerm, terms.length],
  );

  const plannedCount = terms.reduce((n, t) => n + t.length, 0);

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
          {terms.map((courseIds, i) => (
            <TermCard
              key={i}
              index={i}
              courseIds={courseIds}
              courses={courses}
              evaluation={evaluation?.terms[i]}
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
                evaluation.allEligible ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
              }`}
            >
              {evaluation.allEligible
                ? 'All planned courses are eligible. ✓'
                : 'Some courses are blocked — check the details.'}
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
