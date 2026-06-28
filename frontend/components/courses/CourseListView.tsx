'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Course } from '../../lib/api';
import { CourseCard } from './CourseCard';
import { CoursePagination } from './CoursePagination';

type View = 'grid' | 'list';

const STORAGE_KEY = 'courses-view';

const levelBadge = {
  undergraduate: 'bg-[#eef2f8] text-sfbu-navy border-[#c5d3e8]',
  graduate: 'bg-purple-50 text-purple-700 border-purple-200',
};

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={active ? 'text-white' : 'text-gray-500'}
    >
      <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={active ? 'text-white' : 'text-gray-500'}
    >
      <rect x="1" y="2" width="14" height="2.5" rx="1" fill="currentColor" />
      <rect x="1" y="6.75" width="14" height="2.5" rx="1" fill="currentColor" />
      <rect x="1" y="11.5" width="14" height="2.5" rx="1" fill="currentColor" />
    </svg>
  );
}

function CourseRow({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
    >
      <span className="font-mono font-bold text-sm text-gray-700 bg-gray-100 rounded px-2 py-0.5 w-28 shrink-0 text-center">
        {course.courseCode}
      </span>

      <span className="flex-1 font-medium text-gray-900 text-sm leading-snug group-hover:text-sfbu-navy transition-colors truncate">
        {course.title}
      </span>

      <div className="flex items-center gap-3 shrink-0">
        <span
          className={`text-xs font-medium border rounded-full px-2 py-0.5 ${levelBadge[course.level] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}
        >
          {course.level === 'undergraduate' ? 'Undergraduate' : 'Graduate'}
        </span>
        <span className="text-xs text-gray-400 font-medium w-10 text-right">
          {course.creditHours} cr
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300 group-hover:text-sfbu-navy transition-colors"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </Link>
  );
}

interface Props {
  courses: Course[];
  page: number;
  totalPages: number;
  total: number;
  searchParams: Record<string, string>;
}

export function CourseListView({ courses, page, totalPages, total, searchParams }: Props) {
  const [view, setView] = useState<View>('grid');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'list' || stored === 'grid') setView(stored);
    setMounted(true);
  }, []);

  function switchView(next: View) {
    setView(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <div>
      {/* Toolbar: result count + view toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{courses.length}</span> of{' '}
          <span className="font-semibold text-gray-700">{total}</span> courses
        </p>

        {/* Toggle buttons — hidden until hydrated to avoid flicker */}
        <div
          className={`flex rounded-lg border border-gray-200 overflow-hidden transition-opacity ${mounted ? 'opacity-100' : 'opacity-0'}`}
        >
          <button
            onClick={() => switchView('grid')}
            title="Grid view"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
            style={
              view === 'grid'
                ? { backgroundColor: 'var(--sfbu-navy)', color: 'white' }
                : { backgroundColor: 'white', color: '#6b7280' }
            }
          >
            <GridIcon active={view === 'grid'} />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => switchView('list')}
            title="List view"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-l border-gray-200 transition-colors"
            style={
              view === 'list'
                ? { backgroundColor: 'var(--sfbu-navy)', color: 'white' }
                : { backgroundColor: 'white', color: '#6b7280' }
            }
          >
            <ListIcon active={view === 'list'} />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* Grid view */}
      {view === 'grid' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          {courses.map((course) => (
            <CourseRow key={course.id} course={course} />
          ))}
        </div>
      )}

      <CoursePagination
        page={page}
        totalPages={totalPages}
        total={total}
        searchParams={searchParams}
      />
    </div>
  );
}
