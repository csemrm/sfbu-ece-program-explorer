'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminRequirementGroup, AdminCatalogYear } from '../../../lib/admin-api';

interface RgData {
  catalogYearId: string;
  name: string;
  description: string;
  minCredits: number;
  sortOrder: number;
}

interface Props {
  catalogYears: AdminCatalogYear[];
  initial?: Partial<AdminRequirementGroup>;
  onSubmit: (data: RgData) => Promise<void>;
  submitLabel: string;
}

export function RgForm({ catalogYears, initial, onSubmit, submitLabel }: Props) {
  const router = useRouter();
  const [catalogYearId, setCatalogYearId] = useState(initial?.catalogYearId ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [minCredits, setMinCredits] = useState(String(initial?.minCredits ?? '0'));
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? '1'));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({
        catalogYearId,
        name,
        description,
        minCredits: parseFloat(minCredits) || 0,
        sortOrder: parseInt(sortOrder, 10) || 1,
      });
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
          Catalog Year
        </label>
        <select
          required
          value={catalogYearId}
          onChange={(e) => setCatalogYearId(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
        >
          <option value="">Select catalog year…</option>
          {catalogYears.map((cy) => (
            <option key={cy.id} value={cy.id}>
              {cy.academicYear}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Name
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
          placeholder="e.g. Core Requirements"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent resize-none"
          placeholder="Optional description…"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Min Credits
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            required
            value={minCredits}
            onChange={(e) => setMinCredits(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Sort Order
          </label>
          <input
            type="number"
            min="0"
            required
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
          />
        </div>
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
