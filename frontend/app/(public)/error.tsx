'use client';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-gray-200 leading-none">500</p>
      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-6 max-w-md">
        {error.digest
          ? `Error ID: ${error.digest}`
          : 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
