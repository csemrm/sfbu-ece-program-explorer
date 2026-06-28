'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const q = searchParams.get('q') ?? '';
  const level = searchParams.get('level') ?? '';

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      startTransition(() => {
        router.push(`/courses?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-48">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          placeholder="Search by code or title…"
          defaultValue={q}
          onChange={(e) => update('q', e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': 'var(--sfbu-navy)' } as React.CSSProperties}
        />
      </div>

      <select
        value={level}
        onChange={(e) => update('level', e.target.value)}
        className="rounded-lg border border-gray-200 text-sm text-gray-700 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:border-transparent"
        style={{ '--tw-ring-color': 'var(--sfbu-navy)' } as React.CSSProperties}
      >
        <option value="">All Levels</option>
        <option value="undergraduate">Undergraduate</option>
        <option value="graduate">Graduate</option>
      </select>

      {(q || level) && (
        <button
          onClick={() => {
            startTransition(() => router.push('/courses'));
          }}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors px-2 py-1 rounded hover:bg-gray-100"
        >
          Clear filters
        </button>
      )}

      {isPending && (
        <span className="text-xs text-gray-400 flex items-center gap-1.5">
          <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading…
        </span>
      )}
    </div>
  );
}
