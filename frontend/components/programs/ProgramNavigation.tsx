import Link from 'next/link';

interface Props {
  programId: string;
  abbreviation: string;
}

export function ProgramNavigation({ programId, abbreviation }: Props) {
  return (
    <section aria-labelledby="nav-heading">
      <h2 id="nav-heading" className="text-xl font-bold text-gray-900 mb-4">
        Explore Further
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href={`/programs/${programId}/roadmap`}
          className="group rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-all"
          style={{ ['--tw-border-color' as string]: undefined }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3"
            style={{ backgroundColor: 'var(--sfbu-navy)' }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 transition-colors" style={{}}>
            <span className="group-hover:text-sfbu-navy">Curriculum Roadmap</span>
          </h3>
          <p className="text-sm text-gray-500">
            Visual phase-by-phase course progression for {abbreviation}.
          </p>
        </Link>
        <Link
          href={`/programs/${programId}/graph`}
          className="group rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-all"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3"
            style={{ backgroundColor: 'var(--sfbu-gold)' }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="6" cy="6" r="2" />
              <circle cx="18" cy="6" r="2" />
              <circle cx="12" cy="18" r="2" />
              <path d="M8 6h8M7 8l4 8M17 8l-4 8" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 transition-colors">
            <span className="group-hover:text-sfbu-navy">Prerequisite Graph</span>
          </h3>
          <p className="text-sm text-gray-500">
            Interactive dependency graph for all {abbreviation} courses.
          </p>
        </Link>
      </div>
    </section>
  );
}
