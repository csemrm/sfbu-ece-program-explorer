'use client';

import { useRouter } from 'next/navigation';
import { RgForm } from './RgForm';
import type { AdminRequirementGroup, AdminCatalogYear } from '../../../lib/admin-api';
import { adminApi } from '../../../lib/admin-api';

interface RgData {
  catalogYearId: string;
  name: string;
  description: string;
  minCredits: number;
  sortOrder: number;
}

export function EditRgClient({
  rg,
  catalogYears,
}: {
  rg: AdminRequirementGroup;
  catalogYears: AdminCatalogYear[];
}) {
  const router = useRouter();

  async function handleUpdate(data: RgData) {
    const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
    await adminApi.requirementGroups.update(token, rg.id, data);
    router.push('/admin/requirement-groups');
    router.refresh();
  }

  return (
    <RgForm
      catalogYears={catalogYears}
      initial={rg}
      onSubmit={handleUpdate}
      submitLabel="Update Requirement Group"
    />
  );
}
