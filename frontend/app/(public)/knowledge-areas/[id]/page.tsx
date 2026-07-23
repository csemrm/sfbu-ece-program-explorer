import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api, type Course } from '../../../../lib/api';
import { CourseCard } from '../../../../components/courses/CourseCard';
import { Breadcrumb } from '../../../../components/ui/Breadcrumb';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const area = await api.knowledgeAreas.get(id);
    return {
      title: area.name,
      description: area.description ?? undefined,
    };
  } catch {
    return { title: 'Knowledge Area Not Found' };
  }
}

export default async function KnowledgeAreaDetailPage({ params }: Props) {
  const { id } = await params;

  let area;
  try {
    area = await api.knowledgeAreas.get(id);
  } catch {
    notFound();
  }

  const undergraduate = area!.courses.filter((c) => c.level === 'undergraduate');
  const graduate = area!.courses.filter((c) => c.level === 'graduate');

  // CourseCard expects the catalog `Course` shape, where creditHours is a string.
  const toCourse = (c: (typeof area.courses)[number]): Course => ({
    id: c.id,
    courseCode: c.courseCode,
    title: c.title,
    description: c.description,
    creditHours: String(c.creditHours),
    level: c.level,
  });

  const sections = [
    { label: 'Undergraduate', courses: undergraduate },
    { label: 'Graduate', courses: graduate },
  ].filter((s) => s.courses.length > 0);

  return (
    <div>
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--sfbu-navy) 0%, #16294c 100%)',
        }}
      >
        <div className="h-1 w-full" style={{ backgroundColor: 'var(--sfbu-gold)' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-9">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1.5"
            style={{ color: 'var(--sfbu-gold)' }}
          >
            Knowledge Area
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{area!.name}</h1>
          {area!.description && (
            <p className="text-white/70 mt-3 max-w-3xl leading-relaxed">{area!.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mt-6">
            <div>
              <p className="text-2xl font-bold text-white leading-none">{area!.courseCount}</p>
              <p className="text-white/50 text-xs mt-1">Courses</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white leading-none">
                {area!.undergraduateCount}
              </p>
              <p className="text-white/50 text-xs mt-1">Undergraduate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white leading-none">{area!.graduateCount}</p>
              <p className="text-white/50 text-xs mt-1">Graduate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Knowledge Areas', href: '/knowledge-areas' },
            { label: area!.name },
          ]}
        />

        {sections.map((section) => (
          <section key={section.label} className="mb-10 last:mb-0">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--sfbu-gold)' }}
            >
              {section.label}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {section.courses.map((c) => (
                <CourseCard key={c.id} course={toCourse(c)} />
              ))}
            </div>
          </section>
        ))}

        {area!.courses.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-14 text-center">
            <p className="text-gray-500 font-medium mb-1">No courses in this area yet</p>
            <p className="text-gray-400 text-sm">
              Courses are assigned to knowledge areas as the catalog is curated.
            </p>
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Want to see how these courses fit into a degree?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/knowledge-areas"
              className="inline-block rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              ← All Knowledge Areas
            </Link>
            <Link
              href="/programs"
              className="inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--sfbu-navy)' }}
            >
              Explore Programs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
