'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminProgram } from '../../../lib/admin-api';

interface CyData {
  programId: string;
  academicYear: string;
  effectiveDate: string;
}

interface Props {
  programs: AdminProgram[];
  initial?: Partial<CyData & { programId: string }>;
  onSubmit: (data: CyData) => Promise<void>;
  submitLabel: string;
  lockProgram?: boolean;
}

export function CyForm({ programs, initial, onSubmit, submitLabel, lockProgram }: Props) {
  const router = useRouter();
  const [programId, setProgramId] = useState(initial?.programId ?? '');
  const [academicYear, setAcademicYear] = useState(initial?.academicYear ?? '');
  const [effectiveDate, setEffectiveDate] = useState(initial?.effectiveDate ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ programId, academicYear, effectiveDate });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Program
        </label>
        {lockProgram ? (
          <div className="w-full px-3.5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {programs.find((p) => p.id === programId)?.abbreviation ?? programId}
            <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">(cannot change)</span>
          </div>
        ) : (
          <select
            required
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
          >
            <option value="">Select program…</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.abbreviation} — {p.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Academic Year
        </label>
        <input
          required
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
          placeholder="e.g. 2026-2027"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Effective Date <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="date"
          value={effectiveDate}
          onChange={(e) => setEffectiveDate(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 text-white rounded-lg text-sm font-medium disabled:opacity-60 transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--sfbu-navy)' }}
        >
          {loading ? 'Saving…' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
