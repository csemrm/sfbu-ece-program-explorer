'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminProgram } from '../../../lib/admin-api';

interface Props {
  initial?: Partial<AdminProgram>;
  onSubmit: (data: { name: string; abbreviation: string; description: string }) => Promise<void>;
  submitLabel: string;
}

export function ProgramForm({ initial, onSubmit, submitLabel }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [abbreviation, setAbbreviation] = useState(initial?.abbreviation ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ name, abbreviation, description });
      router.push('/admin/programs');
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="Bachelor of Science in Computer Science"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Abbreviation</label>
        <input
          required
          value={abbreviation}
          onChange={(e) => setAbbreviation(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="BSCS"
          maxLength={20}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
          placeholder="Program description…"
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
