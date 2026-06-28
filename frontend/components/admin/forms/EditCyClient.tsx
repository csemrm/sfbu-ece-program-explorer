'use client';

import { useRouter } from 'next/navigation';
import { CyForm } from './CyForm';
import type { AdminCatalogYear, AdminProgram } from '../../../lib/admin-api';
import { adminApi } from '../../../lib/admin-api';

interface Props {
  cy: AdminCatalogYear;
  programs: AdminProgram[];
}

export function EditCyClient({ cy, programs }: Props) {
  const router = useRouter();

  async function handleUpdate(data: {
    programId: string;
    academicYear: string;
    effectiveDate: string;
  }) {
    const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
    await adminApi.catalogYears.update(token, cy.id, {
      academicYear: data.academicYear,
      effectiveDate: data.effectiveDate || undefined,
    });
    router.push('/admin/catalog-years');
    router.refresh();
  }

  return (
    <CyForm
      programs={programs}
      initial={{
        programId: cy.programId,
        academicYear: cy.academicYear,
        effectiveDate: cy.effectiveDate ?? '',
      }}
      onSubmit={handleUpdate}
      submitLabel="Update Catalog Year"
      lockProgram
    />
  );
}
