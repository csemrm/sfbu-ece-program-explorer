'use client';

import { useRouter } from 'next/navigation';
import { CyForm } from './CyForm';
import type { AdminProgram } from '../../../lib/admin-api';
import { adminApi } from '../../../lib/admin-api';

interface CyData {
  programId: string;
  academicYear: string;
  effectiveDate: string;
}

export function NewCyClient({ programs }: { programs: AdminProgram[] }) {
  const router = useRouter();

  async function handleCreate(data: CyData) {
    const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
    await adminApi.catalogYears.create(token, {
      programId: data.programId,
      academicYear: data.academicYear,
      effectiveDate: data.effectiveDate || undefined,
    });
    router.push('/admin/catalog-years');
    router.refresh();
  }

  return <CyForm programs={programs} onSubmit={handleCreate} submitLabel="Create Catalog Year" />;
}
