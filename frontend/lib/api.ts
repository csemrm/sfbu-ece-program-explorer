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

// ── API calls ──────────────────────────────────────────────────

export const api = {
  programs: {
    list: (params?: { page?: number; limit?: number; abbreviation?: string }) =>
      get<PaginatedResult<Program>>('/programs', params as Record<string, string | number>),
    get: (id: string) => get<Program>(`/programs/${id}`),
    requirements: (id: string) => get<ProgramRequirements>(`/programs/${id}/requirements`),
  },
  catalogYears: {
    list: () => get<PaginatedResult<CatalogYear>>('/catalog-years', { limit: 100 }),
  },
  courses: {
    list: (params?: { q?: string; level?: string; page?: number; limit?: number }) =>
      get<PaginatedResult<Course>>('/courses', params as Record<string, string | number>),
  },
  search: {
    query: (q: string, params?: { type?: string; level?: string }) =>
      get('/search', { q, ...params } as Record<string, string | number>),
  },
};
