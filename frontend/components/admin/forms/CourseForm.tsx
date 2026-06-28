'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminCourse } from '../../../lib/admin-api';

interface Props {
  initial?: Partial<AdminCourse>;
  onSubmit: (data: {
    courseCode: string;
    title: string;
    description: string;
    creditHours: number;
    level: string;
  }) => Promise<void>;
  submitLabel: string;
}

export function CourseForm({ initial, onSubmit, submitLabel }: Props) {
  const router = useRouter();
  const [courseCode, setCourseCode] = useState(initial?.courseCode ?? '');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [creditHours, setCreditHours] = useState(String(initial?.creditHours ?? 3));
  const [level, setLevel] = useState(initial?.level ?? 'undergraduate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({
        courseCode,
        title,
        description,
        creditHours: parseFloat(creditHours),
        level,
      });
      router.push('/admin/courses');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Code</label>
          <input
            required
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="CS101"
            maxLength={20}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Credit Hours</label>
          <input
            required
            type="number"
            min={0}
            max={12}
            step={0.5}
            value={creditHours}
            onChange={(e) => setCreditHours(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Introduction to Computer Science"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white"
        >
          <option value="undergraduate">Undergraduate</option>
          <option value="graduate">Graduate</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
          placeholder="Course description…"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-60 transition-colors"
        >
          {loading ? 'Saving…' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
