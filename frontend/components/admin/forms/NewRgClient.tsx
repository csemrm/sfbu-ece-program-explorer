'use client';

import { useRouter } from 'next/navigation';
import { RgForm } from './RgForm';
import type { AdminCatalogYear } from '../../../lib/admin-api';
import { adminApi } from '../../../lib/admin-api';

interface RgData {
  catalogYearId: string;
  name: string;
  description: string;
  minCredits: number;
  sortOrder: number;
}

export function NewRgClient({ catalogYears }: { catalogYears: AdminCatalogYear[] }) {
  const router = useRouter();

  async function handleCreate(data: RgData) {
    const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
    await adminApi.requirementGroups.create(token, data);
    router.push('/admin/requirement-groups');
    router.refresh();
  }

  return (
    <RgForm
      catalogYears={catalogYears}
      onSubmit={handleCreate}
      submitLabel="Create Requirement Group"
    />
  );
}
