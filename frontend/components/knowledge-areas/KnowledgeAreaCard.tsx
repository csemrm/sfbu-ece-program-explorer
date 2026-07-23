import Link from 'next/link';
import type { KnowledgeAreaSummary } from '../../lib/api';

interface Props {
  area: KnowledgeAreaSummary;
}

export function KnowledgeAreaCard({ area }: Props) {
  const { courseCount, undergraduateCount, graduateCount } = area;
  const ugPercent = courseCount > 0 ? (undergraduateCount / courseCount) * 100 : 0;

  return (
    <Link
      href={`/knowledge-areas/${area.id}`}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 hover:border-sfbu-navy/40 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-sfbu-navy transition-colors">
          {area.name}
        </h3>
        <span className="text-xs text-gray-500 font-medium whitespace-nowrap pt-0.5">
          {courseCount} course{courseCount !== 1 ? 's' : ''}
        </span>
      </div>

      {area.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-4">
          {area.description}
        </p>
      )}

      <div className="mt-auto">
        {/* Undergraduate / graduate split */}
        <div
          className="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
          role="img"
          aria-label={`${undergraduateCount} undergraduate and ${graduateCount} graduate courses`}
        >
          {ugPercent > 0 && (
            <div style={{ width: `${ugPercent}%`, backgroundColor: 'var(--sfbu-navy)' }} />
          )}
          {ugPercent < 100 && (
            <div style={{ width: `${100 - ugPercent}%`, backgroundColor: 'var(--sfbu-gold)' }} />
          )}
        </div>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: 'var(--sfbu-navy)' }}
            />
            {undergraduateCount} UG
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: 'var(--sfbu-gold)' }}
            />
            {graduateCount} Grad
          </span>
        </div>
      </div>
    </Link>
  );
}
