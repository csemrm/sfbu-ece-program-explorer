import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../../lib/api';
import { PrerequisiteList } from '../../../../components/courses/PrerequisiteList';
import { Breadcrumb } from '../../../../components/ui/Breadcrumb';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const course = await api.courses.get(id);
    return {
      title: `${course.courseCode} – ${course.title}`,
      description: course.description ?? undefined,
    };
  } catch {
    return { title: 'Course Not Found' };
  }
}

const levelLabel: Record<string, string> = {
  undergraduate: 'Undergraduate',
  graduate: 'Graduate',
};

const levelBadge: Record<string, { bg: string; text: string }> = {
  undergraduate: { bg: '#eef2f8', text: '#1c3766' },
  graduate: { bg: '#f3f0ff', text: '#6d28d9' },
};

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;

  let course, prereqs;
  try {
    [course, prereqs] = await Promise.all([api.courses.get(id), api.courses.prerequisites(id)]);
  } catch {
    notFound();
  }

  const badge = levelBadge[course.level] ?? { bg: '#f3f4f6', text: '#374151' };

  return (
    <div>
      {/* Hero — SFBU navy, consistent with program heroes */}
      <div
        className="text-white py-12 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1c3766 0%, #0d2144 100%)' }}
      >
        {/* Gold accent bar */}
        <div
          className="h-1 w-full absolute top-0 left-0"
          style={{ backgroundColor: 'var(--sfbu-gold)' }}
        />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, white 1px, transparent 0), radial-gradient(circle at 75% 75%, white 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono font-bold text-base bg-white/15 rounded-lg px-3 py-1.5 tracking-wide">
              {course.courseCode}
            </span>
            <span
              className="text-xs font-semibold rounded-full px-3 py-1"
              style={{ backgroundColor: badge.bg, color: badge.text }}
            >
              {levelLabel[course.level] ?? course.level}
            </span>
            <span className="text-sm text-white/50">
              {course.creditHours} credit hour{course.creditHours !== 1 ? 's' : ''}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {course.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Courses', href: '/courses' },
            { label: course.courseCode },
          ]}
        />

        <div className="space-y-8">
          {/* Description */}
          {course.description && (
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'var(--sfbu-gold)' }}
              >
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </section>
          )}

          {/* Course info */}
          <section>
            <h2
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--sfbu-gold)' }}
            >
              Course Information
            </h2>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--sfbu-navy)' }}>
                    <th className="text-left px-5 py-3 font-semibold text-white w-40">Field</th>
                    <th className="text-left px-5 py-3 font-semibold text-white">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-500">Course Code</td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-gray-900">
                      {course.courseCode}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-500">Credit Hours</td>
                    <td className="px-5 py-3.5 text-gray-900">{course.creditHours}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-500">Level</td>
                    <td className="px-5 py-3.5 text-gray-900">
                      {levelLabel[course.level] ?? course.level}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Prerequisites */}
          <section>
            <h2
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--sfbu-gold)' }}
            >
              Prerequisites &amp; Corequisites
            </h2>
            <PrerequisiteList
              prerequisites={prereqs.prerequisites}
              corequisites={prereqs.corequisites}
            />
          </section>

          {/* Explore further */}
          <section>
            <h2
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--sfbu-gold)' }}
            >
              Explore Further
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/programs"
                className="group rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-all block"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3"
                  style={{ backgroundColor: 'var(--sfbu-navy)' }}
                >
                  <svg
                    width="16"
                    height="16"
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
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-sfbu-navy transition-colors">
                  Prerequisite Graph
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  View {course.courseCode} in the full dependency graph.
                </p>
                <span
                  className="inline-block text-xs font-medium"
                  style={{ color: 'var(--sfbu-navy)' }}
                >
                  Select a program →
                </span>
              </Link>
              <Link
                href="/programs"
                className="group rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-all block"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3"
                  style={{ backgroundColor: 'var(--sfbu-gold)' }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-sfbu-navy transition-colors">
                  Curriculum Roadmap
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  See where {course.courseCode} fits in the semester plan.
                </p>
                <span
                  className="inline-block text-xs font-medium"
                  style={{ color: 'var(--sfbu-navy)' }}
                >
                  Select a program →
                </span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
