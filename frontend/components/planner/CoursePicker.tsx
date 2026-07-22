'use client';

import { useMemo, useRef, useState } from 'react';
import type { Course } from '../../lib/api';

interface Props {
  courses: Course[];
  /** IDs already chosen — excluded from the results. */
  excludeIds: Set<string>;
  onSelect: (courseId: string) => void;
  placeholder?: string;
}

/** A small searchable combobox for adding a course by code or title. */
export function CoursePicker({ courses, excludeIds, onSelect, placeholder }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses
      .filter((c) => !excludeIds.has(c.id))
      .filter(
        (c) =>
          q === '' || c.courseCode.toLowerCase().includes(q) || c.title.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [courses, excludeIds, query]);

  const choose = (id: string) => {
    onSelect(id);
    setQuery('');
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Delay so a click on an option registers before the list closes.
          blurTimer.current = setTimeout(() => setOpen(false), 120);
        }}
        placeholder={placeholder ?? 'Search by code or title…'}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sfbu-navy focus:outline-none focus:ring-1 focus:ring-sfbu-navy"
        aria-label={placeholder ?? 'Add a course'}
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {matches.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                // onMouseDown fires before the input's blur, so the pick isn't lost.
                onMouseDown={() => {
                  if (blurTimer.current) clearTimeout(blurTimer.current);
                  choose(c.id);
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <span className="w-24 shrink-0 rounded bg-gray-100 px-2 py-0.5 text-center font-mono text-xs font-bold text-gray-700">
                  {c.courseCode}
                </span>
                <span className="truncate text-gray-700">{c.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
