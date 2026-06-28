const SERVER_BASE = process.env.API_BASE_URL ?? 'http://localhost:3001/api/v1';
const BROWSER_BASE =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/api/v1')
    : SERVER_BASE;

async function adminFetch<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const base = typeof window !== 'undefined' ? BROWSER_BASE : SERVER_BASE;
  const res = await fetch(`${base}/admin/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${msg}`);
  }
  return res.json() as Promise<T>;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  programs: number;
  courses: number;
  catalogYears: number;
  recentActivity: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  adminEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  payload: Record<string, unknown> | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminProgram {
  id: string;
  name: string;
  abbreviation: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCourse {
  id: string;
  courseCode: string;
  title: string;
  description: string | null;
  creditHours: number;
  level: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCatalogYear {
  id: string;
  programId: string;
  academicYear: string;
  effectiveDate: string | null;
  createdAt: string;
}

export interface AdminRequirementGroup {
  id: string;
  catalogYearId: string;
  name: string;
  description: string | null;
  minCredits: number | null;
  sortOrder: number;
}

export interface AdminKnowledgeArea {
  id: string;
  name: string;
  description: string | null;
}

// Client-side login (uses NEXT_PUBLIC_API_URL)
export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/api/v1';
  const res = await fetch(`${base}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = (await res.json()) as { user: AdminUser };
  return data.user;
}

export async function logoutAdmin(): Promise<void> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/api/v1';
  await fetch(`${base}/admin/auth/logout`, { method: 'POST', credentials: 'include' });
}

export const adminApi = {
  auth: {
    me: (token: string) => adminFetch<AdminUser>('auth/me', token),
  },
  dashboard: {
    stats: (token: string) => adminFetch<DashboardStats>('dashboard', token),
  },
  programs: {
    list: (token: string, page = 1, q?: string) =>
      adminFetch<PaginatedResponse<AdminProgram>>(
        `programs?page=${page}${q ? `&q=${encodeURIComponent(q)}` : ''}`,
        token,
      ),
    get: (token: string, id: string) => adminFetch<AdminProgram>(`programs/${id}`, token),
    create: (token: string, body: Partial<AdminProgram>) =>
      adminFetch<AdminProgram>('programs', token, { method: 'POST', body: JSON.stringify(body) }),
    update: (token: string, id: string, body: Partial<AdminProgram>) =>
      adminFetch<AdminProgram>(`programs/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (token: string, id: string) =>
      adminFetch<{ success: boolean }>(`programs/${id}`, token, { method: 'DELETE' }),
  },
  courses: {
    list: (token: string, page = 1, q?: string, level?: string) =>
      adminFetch<PaginatedResponse<AdminCourse>>(
        `courses?page=${page}${q ? `&q=${encodeURIComponent(q)}` : ''}${level ? `&level=${level}` : ''}`,
        token,
      ),
    get: (token: string, id: string) => adminFetch<AdminCourse>(`courses/${id}`, token),
    create: (token: string, body: Partial<AdminCourse>) =>
      adminFetch<AdminCourse>('courses', token, { method: 'POST', body: JSON.stringify(body) }),
    update: (token: string, id: string, body: Partial<AdminCourse>) =>
      adminFetch<AdminCourse>(`courses/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (token: string, id: string) =>
      adminFetch<{ success: boolean }>(`courses/${id}`, token, { method: 'DELETE' }),
  },
  requirementGroups: {
    list: (token: string, catalogYearId?: string) =>
      adminFetch<PaginatedResponse<AdminRequirementGroup>>(
        `requirement-groups${catalogYearId ? `?catalogYearId=${catalogYearId}` : ''}`,
        token,
      ),
    get: (token: string, id: string) =>
      adminFetch<AdminRequirementGroup>(`requirement-groups/${id}`, token),
    create: (token: string, body: Partial<AdminRequirementGroup>) =>
      adminFetch<AdminRequirementGroup>('requirement-groups', token, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (token: string, id: string, body: Partial<AdminRequirementGroup>) =>
      adminFetch<AdminRequirementGroup>(`requirement-groups/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (token: string, id: string) =>
      adminFetch<{ success: boolean }>(`requirement-groups/${id}`, token, { method: 'DELETE' }),
  },
  knowledgeAreas: {
    list: (token: string) => adminFetch<AdminKnowledgeArea[]>('knowledge-areas', token),
    get: (token: string, id: string) =>
      adminFetch<AdminKnowledgeArea>(`knowledge-areas/${id}`, token),
    create: (token: string, body: Partial<AdminKnowledgeArea>) =>
      adminFetch<AdminKnowledgeArea>('knowledge-areas', token, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    update: (token: string, id: string, body: Partial<AdminKnowledgeArea>) =>
      adminFetch<AdminKnowledgeArea>(`knowledge-areas/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    delete: (token: string, id: string) =>
      adminFetch<{ success: boolean }>(`knowledge-areas/${id}`, token, { method: 'DELETE' }),
  },
  catalogYears: {
    list: (token: string, programId?: string) =>
      adminFetch<AdminCatalogYear[]>(
        `catalog-years${programId ? `?programId=${programId}` : ''}`,
        token,
      ),
    get: (token: string, id: string) => adminFetch<AdminCatalogYear>(`catalog-years/${id}`, token),
    create: (token: string, body: Partial<AdminCatalogYear>) =>
      adminFetch<AdminCatalogYear>('catalog-years', token, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
  auditLog: {
    list: (token: string, page = 1) =>
      adminFetch<PaginatedResponse<AuditEntry>>(`audit-log?page=${page}`, token),
  },
};
