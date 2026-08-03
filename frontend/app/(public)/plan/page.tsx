import type { Metadata } from 'next';
import { api, type Course, type TermSummary } from '../../../lib/api';
import {
  courseIdsFromRoadmap,
  groupOrderFromRoadmap,
  groupsFromRoadmap,
  tiersFromRoadmap,
  type ProgramOption,
} from '../../../lib/programScope';
import { Breadcrumb } from '../../../components/ui/Breadcrumb';
import { OfferingPlanner } from '../../../components/planner/OfferingPlanner';

export const metadata: Metadata = {
  title: 'Semester Planner',
  description:
    'Plan your semesters, mark completed courses, and check prerequisite eligibility before you register.',
};

async function loadAllCourses(): Promise<Course[]> {
  const limit = 100;
  const first = await api.courses.list({ page: 1, limit });
  const courses = [...first.data];
  for (let page = 2; page <= first.totalPages; page++) {
    const next = await api.courses.list({ page, limit });
    courses.push(...next.data);
  }
  return courses;
}

/**
 * Academic terms are optional context: if none are curated (or the endpoint
 * fails) the planner still works, it just skips the availability check rather
 * than taking the whole page down with it.
 */
async function loadTerms(): Promise<TermSummary[]> {
  try {
    return await api.terms.list();
  } catch {
    return [];
  }
}

/**
 * Degrees the planner can be scoped to.
 *
 * There is no "courses in this program" endpoint, so each program's course set
 * is derived from its roadmap. A program whose roadmap fails to load keeps an
 * empty set, which the planner reads as "do not scope" rather than as "this
 * degree has no courses".
 */
async function loadProgramOptions(): Promise<ProgramOption[]> {
  try {
    const programs = await api.programs.list({ limit: 50 });
    return await Promise.all(
      programs.data.map(async (p) => {
        const base = { id: p.id, abbreviation: p.abbreviation, name: p.name };
        try {
          const roadmap = await api.programs.roadmap(p.id);
          return {
            ...base,
            courseIds: courseIdsFromRoadmap(roadmap),
            tiers: tiersFromRoadmap(roadmap),
            groups: groupsFromRoadmap(roadmap),
            groupOrder: groupOrderFromRoadmap(roadmap),
          };
        } catch {
          return { ...base, courseIds: [], tiers: {}, groups: {}, groupOrder: {} };
        }
      }),
    );
  } catch {
    return [];
  }
}

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string }>;
}) {
  // Linked from a program page, so the planner opens on that degree rather than
  // whatever the browser last stored.
  const { program: requestedProgramId } = await searchParams;
  let courses: Course[];
  try {
    courses = await loadAllCourses();
  } catch {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-red-700 font-medium mb-1">Unable to load courses</p>
          <p className="text-red-500 text-sm">
            The planner needs the course catalog. The server may be temporarily unavailable.
          </p>
        </div>
      </div>
    );
  }

  const [academicTerms, programs] = await Promise.all([loadTerms(), loadProgramOptions()]);

  return (
    <div>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-7">
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Semester Planner' }]} />
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'var(--sfbu-gold)' }}
          >
            ECE Department
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Semester Planner</h1>
          <p className="text-gray-500 mt-1.5 text-base max-w-2xl">
            Choose your degree, mark the courses you&apos;ve completed, then pick from what&apos;s
            actually offered next semester. Anything with prerequisites you haven&apos;t met yet is
            highlighted, with the missing courses named, and your plan can be downloaded as a PDF.
            Nothing is saved to any server — it lives only in this browser.
          </p>
        </div>
      </div>

      {/* Wider than the rest of the site — three columns need the room. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <OfferingPlanner
          courses={courses}
          academicTerms={academicTerms}
          programs={programs}
          initialProgramId={requestedProgramId ?? null}
        />
      </div>
    </div>
  );
}
