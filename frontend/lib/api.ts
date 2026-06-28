const serverBase = process.env.API_BASE_URL ?? 'http://localhost:3001/api/v1';
const clientBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/api/v1';

function base() {
  return typeof window === 'undefined' ? serverBase : clientBase;
}

async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${base()}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Types ──────────────────────────────────────────────────────

export interface Program {
  id: string;
  name: string;
  abbreviation: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RequirementGroup {
  id: string;
  name: string;
  description: string | null;
  minCredits: number | null;
  sortOrder: number;
}

export interface CatalogYear {
  id: string;
  academicYear: string;
  effectiveDate: string | null;
  program: Program;
}

export interface ProgramRequirements {
  programId: string;
  programName: string;
  catalogYears: Array<{
    id: string;
    academicYear: string;
    effectiveDate: string | null;
    requirementGroups: RequirementGroup[];
  }>;
}

export interface Course {
  id: string;
  courseCode: string;
  title: string;
  description: string | null;
  creditHours: string;
  level: 'undergraduate' | 'graduate';
}

export interface CoursePrerequisiteItem {
  id: string;
  courseCode: string;
  title: string;
  creditHours: number;
  level: 'undergraduate' | 'graduate';
}

export interface CoursePrerequisites {
  courseId: string;
  courseCode: string;
  prerequisites: CoursePrerequisiteItem[];
  corequisites: CoursePrerequisiteItem[];
}

export interface GraphNode {
  id: string;
  courseCode: string;
  title: string;
  creditHours: number;
  level: 'undergraduate' | 'graduate';
  description: string | null;
  inProgram: boolean;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'prerequisite' | 'corequisite';
}

export interface ProgramGraph {
  programId: string;
  programName: string;
  programAbbreviation: string;
  academicYear: string | null;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface RoadmapCourse {
  id: string;
  courseCode: string;
  title: string;
  creditHours: number;
  level: 'undergraduate' | 'graduate';
  description: string | null;
}

export interface RoadmapPhase {
  id: string;
  name: string;
  description: string | null;
  minCredits: number | null;
  sortOrder: number;
  courses: RoadmapCourse[];
}

export interface ProgramRoadmap {
  programId: string;
  programName: string;
  programAbbreviation: string;
  catalogYearId: string | null;
  academicYear: string | null;
  phases: RoadmapPhase[];
}

export interface SearchResult {
  type: 'program' | 'course';
  id: string;
  code?: string;
  title: string;
  description: string | null;
  creditHours?: number;
  level?: string;
}

// ── API calls ──────────────────────────────────────────────────

export const api = {
  programs: {
    list: (params?: { page?: number; limit?: number; abbreviation?: string }) =>
      get<PaginatedResult<Program>>('/programs', params as Record<string, string | number>),
    get: (id: string) => get<Program>(`/programs/${id}`),
    requirements: (id: string) => get<ProgramRequirements>(`/programs/${id}/requirements`),
    roadmap: (id: string) => get<ProgramRoadmap>(`/programs/${id}/roadmap`),
    graph: (id: string) => get<ProgramGraph>(`/programs/${id}/graph`),
  },
  catalogYears: {
    list: () => get<PaginatedResult<CatalogYear>>('/catalog-years', { limit: 100 }),
  },
  courses: {
    list: (params?: { q?: string; level?: string; page?: number; limit?: number }) =>
      get<PaginatedResult<Course>>('/courses', params as Record<string, string | number>),
    get: (id: string) => get<Course>(`/courses/${id}`),
    prerequisites: (id: string) => get<CoursePrerequisites>(`/courses/${id}/prerequisites`),
  },
  search: {
    query: (q: string, params?: { type?: string; level?: string }) =>
      get<PaginatedResult<SearchResult>>('/search', { q, ...params } as Record<
        string,
        string | number
      >),
  },
};
