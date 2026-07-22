'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminApi, type AdminOffering, type AdminTerm } from '../../lib/admin-api';
import { api, type Course, type EvaluatedCourse } from '../../lib/api';
import { CoursePicker } from '../planner/CoursePicker';

function getToken(): string {
  return document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
}

function msg(e: unknown): string {
  return e instanceof Error ? e.message : 'Something went wrong.';
}

interface Props {
  initialTerms: AdminTerm[];
  courses: Course[];
}

export function OfferingsManager({ initialTerms, courses }: Props) {
  const [terms, setTerms] = useState(initialTerms);
  const [thisTermId, setThisTermId] = useState(initialTerms[0]?.id ?? '');
  const [nextTermId, setNextTermId] = useState(initialTerms[1]?.id ?? initialTerms[0]?.id ?? '');
  const [left, setLeft] = useState<AdminOffering[]>([]);
  const [right, setRight] = useState<AdminOffering[]>([]);
  const [verdicts, setVerdicts] = useState<Record<string, EvaluatedCourse>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [newTermName, setNewTermName] = useState('');

  const sameTerm = thisTermId !== '' && thisTermId === nextTermId;

  const loadOfferings = useCallback(async () => {
    const token = getToken();
    try {
      const [l, r] = await Promise.all([
        thisTermId ? adminApi.offerings.list(token, thisTermId) : Promise.resolve([]),
        nextTermId ? adminApi.offerings.list(token, nextTermId) : Promise.resolve([]),
      ]);
      setLeft(l);
      setRight(r);
      setError(null);
    } catch (e) {
      setError(msg(e));
    }
  }, [thisTermId, nextTermId]);

  useEffect(() => {
    void loadOfferings();
  }, [loadOfferings]);

  // Right-column eligibility = prerequisites satisfied by the left column.
  useEffect(() => {
    let active = true;
    const rightIds = right.map((o) => o.courseId);
    if (rightIds.length === 0) {
      setVerdicts({});
      return;
    }
    api.planner
      .evaluate({
        completedCourseIds: [],
        terms: [{ courseIds: left.map((o) => o.courseId) }, { courseIds: rightIds }],
      })
      .then((res) => {
        if (!active) return;
        const map: Record<string, EvaluatedCourse> = {};
        (res.terms[1]?.courses ?? []).forEach((c) => {
          map[c.courseId] = c;
        });
        setVerdicts(map);
      })
      .catch((e: unknown) => active && setError(msg(e)));
    return () => {
      active = false;
    };
  }, [left, right]);

  const addOffering = async (termId: string, courseId: string) => {
    try {
      await adminApi.offerings.add(getToken(), { termId, courseId });
      await loadOfferings();
    } catch (e) {
      setError(msg(e));
    }
  };
  const removeOffering = async (id: string) => {
    try {
      await adminApi.offerings.remove(getToken(), id);
      await loadOfferings();
    } catch (e) {
      setError(msg(e));
    }
  };

  const createTerm = async () => {
    const name = newTermName.trim();
    if (!name) return;
    try {
      const term = await adminApi.offerings.createTerm(getToken(), {
        name,
        sortOrder: terms.length + 1,
      });
      setTerms((prev) => [...prev, term]);
      setNextTermId(term.id);
      setNewTermName('');
    } catch (e) {
      setError(msg(e));
    }
  };

  const toggleSelected = (courseId: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });

  const selectedList = useMemo(() => [...selected], [selected]);
  const selectedEligible = selectedList.filter((id) => verdicts[id]?.eligible).length;
  const selectedBlocked = selectedList.length - selectedEligible;

  const leftIds = useMemo(() => new Set(left.map((o) => o.courseId)), [left]);
  const rightIds = useMemo(() => new Set(right.map((o) => o.courseId)), [right]);

  if (terms.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
          No academic terms yet. Create one to start adding offerings.
        </p>
        <div className="flex gap-2">
          <input
            value={newTermName}
            onChange={(e) => setNewTermName(e.target.value)}
            placeholder="e.g. Fall 2026"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
          <button
            onClick={createTerm}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: 'var(--sfbu-navy)' }}
          >
            Create term
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* New term inline */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Add a term:</span>
        <input
          value={newTermName}
          onChange={(e) => setNewTermName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createTerm()}
          placeholder="e.g. Fall 2027"
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
        <button
          onClick={createTerm}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          + Create
        </button>
      </div>

      {sameTerm && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
          &ldquo;This semester&rdquo; and &ldquo;next semester&rdquo; are the same term — pick two
          different terms for a meaningful eligibility check.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* LEFT: this semester */}
        <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-700">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              This semester
            </span>
            <select
              value={thisTermId}
              onChange={(e) => {
                setThisTermId(e.target.value);
                setSelected(new Set());
              }}
              className="ml-auto rounded-lg border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-3 p-4">
            <CoursePicker
              courses={courses}
              excludeIds={leftIds}
              onSelect={(id) => addOffering(thisTermId, id)}
              placeholder="Offer a course this semester…"
            />
            <OfferingList
              offerings={left}
              onRemove={removeOffering}
              empty="No courses offered this semester yet."
            />
          </div>
        </section>

        {/* RIGHT: next semester */}
        <section className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-700">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Next semester
            </span>
            <select
              value={nextTermId}
              onChange={(e) => {
                setNextTermId(e.target.value);
                setSelected(new Set());
              }}
              className="ml-auto rounded-lg border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-3 p-4">
            <CoursePicker
              courses={courses}
              excludeIds={rightIds}
              onSelect={(id) => addOffering(nextTermId, id)}
              placeholder="Offer a course next semester…"
            />
            {right.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400">
                No courses offered next semester yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {right.map((o) => {
                  const v = verdicts[o.courseId];
                  const ok = v?.eligible;
                  return (
                    <li
                      key={o.id}
                      className={`rounded-lg border px-3 py-2.5 ${
                        v
                          ? ok
                            ? 'border-green-200 bg-green-50/50'
                            : 'border-red-200 bg-red-50/50'
                          : 'border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={selected.has(o.courseId)}
                          onChange={() => toggleSelected(o.courseId)}
                          className="h-4 w-4 shrink-0 accent-[color:var(--sfbu-navy)]"
                          aria-label={`Select ${o.course.courseCode} for next semester`}
                        />
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                          {o.course.courseCode}
                        </span>
                        <span className="truncate text-sm text-gray-800 dark:text-gray-100">
                          {o.course.title}
                        </span>
                        {v && (
                          <span
                            className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                              ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {ok ? 'Eligible' : 'Not eligible'}
                          </span>
                        )}
                        <button
                          onClick={() => removeOffering(o.id)}
                          className="shrink-0 rounded p-1 text-gray-400 hover:text-red-500"
                          aria-label={`Remove ${o.course.courseCode}`}
                          title="Remove offering"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M3 3l8 8M11 3l-8 8"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                      {v && !ok && <p className="mt-1 pl-6 text-xs text-red-600">{v.reason}</p>}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Selection summary */}
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        {selectedList.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Check next-semester courses above to see whether a student could register for them.
          </p>
        ) : (
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Selected <strong>{selectedList.length}</strong> course
            {selectedList.length !== 1 ? 's' : ''} for next semester —{' '}
            <span className="font-medium text-green-700">{selectedEligible} eligible</span>
            {selectedBlocked > 0 && (
              <>
                {', '}
                <span className="font-medium text-red-600">{selectedBlocked} blocked</span>
              </>
            )}
            .
          </p>
        )}
      </div>
    </div>
  );
}

function OfferingList({
  offerings,
  onRemove,
  empty,
}: {
  offerings: AdminOffering[];
  onRemove: (id: string) => void;
  empty: string;
}) {
  if (offerings.length === 0) {
    return <p className="py-4 text-center text-sm text-gray-400">{empty}</p>;
  }
  return (
    <ul className="space-y-2">
      {offerings.map((o) => (
        <li
          key={o.id}
          className="flex items-center gap-2.5 rounded-lg border border-gray-100 px-3 py-2.5 dark:border-gray-700"
        >
          <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
            {o.course.courseCode}
          </span>
          <span className="truncate text-sm text-gray-800 dark:text-gray-100">
            {o.course.title}
          </span>
          <span className="ml-auto shrink-0 text-xs text-gray-400">{o.course.creditHours} cr</span>
          <button
            onClick={() => onRemove(o.id)}
            className="shrink-0 rounded p-1 text-gray-400 hover:text-red-500"
            aria-label={`Remove ${o.course.courseCode}`}
            title="Remove offering"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 3l8 8M11 3l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}
