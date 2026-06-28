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
          className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="text-2xl mb-2">🗺️</div>
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
            Curriculum Roadmap
          </h3>
          <p className="text-sm text-gray-500">
            Visual phase-by-phase course progression for {abbreviation}.
          </p>
        </Link>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-2xl mb-2">🔗</div>
          <h3 className="font-semibold text-gray-900 mb-1">Prerequisite Graph</h3>
          <p className="text-sm text-gray-500 mb-3">
            Interactive dependency graph for all {abbreviation} courses.
          </p>
          <span className="inline-block text-xs text-gray-400 bg-gray-100 rounded px-2 py-1">
            Coming in Epic 007
          </span>
        </div>
      </div>
    </section>
  );
}
