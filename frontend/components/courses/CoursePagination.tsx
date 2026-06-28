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
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">{total}</span> course{total !== 1 ? 's' : ''}{' '}
        &mdash; page <span className="font-medium text-gray-700">{page}</span> of {totalPages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link
            href={pageHref(page - 1, searchParams)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            ← Previous
          </Link>
        ) : (
          <span className="rounded-lg border border-gray-100 px-4 py-2 text-sm font-medium text-gray-300 cursor-not-allowed select-none">
            ← Previous
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={pageHref(page + 1, searchParams)}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--sfbu-navy)' }}
          >
            Next →
          </Link>
        ) : (
          <span className="rounded-lg border border-gray-100 px-4 py-2 text-sm font-medium text-gray-300 cursor-not-allowed select-none">
            Next →
          </span>
        )}
      </div>
    </div>
  );
}
