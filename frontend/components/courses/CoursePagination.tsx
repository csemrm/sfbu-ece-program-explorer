import Link from 'next/link';

interface Props {
  page: number;
  totalPages: number;
  total: number;
  searchParams: Record<string, string>;
}

function pageHref(p: number, searchParams: Record<string, string>) {
  const params = new URLSearchParams(searchParams);
  params.set('page', String(p));
  return `/courses?${params.toString()}`;
}

export function CoursePagination({ page, totalPages, total, searchParams }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-8">
      <p className="text-sm text-gray-500">
        {total} course{total !== 1 ? 's' : ''} &mdash; page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link
            href={pageHref(page - 1, searchParams)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Previous
          </Link>
        ) : (
          <span className="rounded-lg border border-gray-100 px-4 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
            ← Previous
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={pageHref(page + 1, searchParams)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Next →
          </Link>
        ) : (
          <span className="rounded-lg border border-gray-100 px-4 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
            Next →
          </span>
        )}
      </div>
    </div>
  );
}
