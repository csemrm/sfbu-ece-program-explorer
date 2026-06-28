import Link from 'next/link';
import { api } from '../../lib/api';
import { ProgramCard } from '../../components/programs/ProgramCard';

const FEATURES = [
  {
    title: 'Program Requirements',
    desc: 'Degree requirements, credit breakdowns, and requirement groups for each program.',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    accent: 'var(--sfbu-navy)',
  },
  {
    title: 'Course Catalog',
    desc: 'All courses with descriptions, credit hours, prerequisites, and corequisites.',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    accent: 'var(--sfbu-gold)',
  },
  {
    title: 'Curriculum Roadmap',
    desc: 'Semester-by-semester visual roadmaps and prerequisite dependency graphs.',
    icon: (
      <svg
        width="22"
        height="22"
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
    ),
    accent: '#16a34a',
  },
];

export default async function Home() {
  let programs: Awaited<ReturnType<typeof api.programs.list>>['data'] = [];
  try {
    const result = await api.programs.list({ limit: 100 });
    programs = result.data;
  } catch {
    // Backend unavailable — render page with empty programs list
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="text-white py-20 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1c3766 0%, #0d2144 100%)' }}
      >
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, white 1px, transparent 0), radial-gradient(circle at 75% 75%, white 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {programs.map((p) => (
              <span
                key={p.id}
                className="rounded-full bg-white/15 border border-white/20 px-4 py-1 text-sm font-semibold tracking-wide"
              >
                {p.abbreviation}
              </span>
            ))}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
            SFBU ECE Program Explorer
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Interactive curriculum visualization for the Electrical and Computer Engineering
            Department at San Francisco Bay University.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/programs"
              className="rounded-full font-semibold px-7 py-3 text-sm transition-opacity hover:opacity-90 text-white shadow-lg"
              style={{ backgroundColor: 'var(--sfbu-gold)' }}
            >
              Browse Programs
            </Link>
            <Link
              href="/courses"
              className="rounded-full border border-white/40 text-white font-semibold px-7 py-3 text-sm hover:bg-white/10 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Programs grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Academic Programs</h2>
            <p className="text-gray-500 mt-1">
              Select a program to view requirements and curriculum.
            </p>
          </div>
          <Link
            href="/programs"
            className="text-sm font-medium hover:underline hidden sm:block"
            style={{ color: 'var(--sfbu-navy)' }}
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            What You Can Explore
          </h2>
          <p className="text-gray-500 text-center mb-10 text-sm">
            Everything you need to understand your academic journey at SFBU.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"
                  style={{ backgroundColor: f.accent }}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
