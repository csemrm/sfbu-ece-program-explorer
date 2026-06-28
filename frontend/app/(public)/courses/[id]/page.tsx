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

const levelColors: Record<string, string> = {
  undergraduate: 'bg-blue-50 text-blue-700 border-blue-200',
  graduate: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;

  let course, prereqs;
  try {
    [course, prereqs] = await Promise.all([api.courses.get(id), api.courses.prerequisites(id)]);
  } catch {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-950 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="font-mono font-bold text-lg bg-white/10 rounded px-3 py-1">
              {course.courseCode}
            </span>
            <span
              className={`text-xs font-medium border rounded-full px-3 py-1 ${levelColors[course.level]}`}
            >
              {levelLabel[course.level] ?? course.level}
            </span>
            <span className="text-sm text-white/60">{course.creditHours} credit hours</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {course.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Breadcrumb
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Courses', href: '/courses' },
            { label: course.courseCode },
          ]}
        />

        <div className="space-y-8 mt-6">
          {/* Description */}
          {course.description && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </section>
          )}

          {/* Course info */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Course Information</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-5 py-3 font-medium text-gray-500 w-40">Course Code</td>
                    <td className="px-5 py-3 font-mono font-semibold text-gray-900">
                      {course.courseCode}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-medium text-gray-500">Credits</td>
                    <td className="px-5 py-3 text-gray-900">{course.creditHours}</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3 font-medium text-gray-500">Level</td>
                    <td className="px-5 py-3 text-gray-900">
                      {levelLabel[course.level] ?? course.level}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Prerequisites */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Prerequisites & Corequisites</h2>
            <PrerequisiteList
              prerequisites={prereqs.prerequisites}
              corequisites={prereqs.corequisites}
            />
          </section>

          {/* Explore further */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Explore Further</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/programs"
                className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all block"
              >
                <div className="text-2xl mb-2">🔗</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                  Prerequisite Graph
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  View {course.courseCode} in the full dependency graph.
                </p>
                <span className="inline-block text-xs text-blue-600 font-medium">
                  Select a program →
                </span>
              </Link>
              <Link
                href="/programs"
                className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all block"
              >
                <div className="text-2xl mb-2">🗺️</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                  Curriculum Roadmap
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  See where {course.courseCode} fits in the semester plan.
                </p>
                <span className="inline-block text-xs text-blue-600 font-medium">
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
