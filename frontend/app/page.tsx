import Link from 'next/link';
import { api } from '../lib/api';
import { ProgramCard } from '../components/programs/ProgramCard';

export default async function Home() {
  const result = await api.programs.list({ limit: 100 });
  const programs = result.data;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {programs.map((p) => (
              <span key={p.id} className="rounded-full bg-white/15 px-4 py-1 text-sm font-semibold">
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
              className="rounded-full bg-white text-blue-800 font-semibold px-6 py-3 text-sm hover:bg-blue-50 transition-colors"
            >
              Browse Programs
            </Link>
            <Link
              href="/courses"
              className="rounded-full border border-white/40 text-white font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors"
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
            className="text-sm font-medium text-blue-700 hover:underline hidden sm:block"
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
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            What You Can Explore
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: '📋',
                title: 'Program Requirements',
                desc: 'Degree requirements, credit breakdowns, and requirement groups for each program.',
              },
              {
                icon: '📚',
                title: 'Course Catalog',
                desc: 'All courses with descriptions, credit hours, prerequisites, and corequisites.',
              },
              {
                icon: '🗺️',
                title: 'Curriculum Roadmap',
                desc: 'Semester-by-semester visual roadmaps and prerequisite dependency graphs.',
              },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
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
