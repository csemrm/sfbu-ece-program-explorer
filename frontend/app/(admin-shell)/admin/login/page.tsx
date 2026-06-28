'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAdmin } from '../../../../lib/admin-api';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(email, password);
      const next = searchParams.get('next') ?? '/admin/dashboard';
      router.push(next);
      router.refresh();
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: 'var(--sfbu-navy)' }}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, white 1px, transparent 0), radial-gradient(circle at 75% 75%, white 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg"
            style={{ backgroundColor: 'var(--sfbu-gold)' }}
          >
            SF
          </div>
          <h1 className="text-2xl font-bold text-white">SFBU ECE Admin</h1>
          <p className="text-white/50 text-sm mt-1">Sign in to manage catalog content</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1" style={{ backgroundColor: 'var(--sfbu-gold)' }} />
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="admin@sfbu.edu"
                autoComplete="email"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-white rounded-lg text-sm font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--sfbu-navy)' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          San Francisco Bay University · ECE Program Explorer
        </p>
      </div>
    </div>
  );
}
