'use client';

import { useRouter } from 'next/navigation';
import { ProgramForm } from '../../../../../../components/admin/forms/ProgramForm';
import { adminApi } from '../../../../../../lib/admin-api';

export default function NewProgramPage() {
  const router = useRouter();

  async function handleCreate(data: { name: string; abbreviation: string; description: string }) {
    const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
    await adminApi.programs.create(token, data);
    router.push('/admin/programs');
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">New Program</h1>
      <ProgramForm onSubmit={handleCreate} submitLabel="Create Program" />
    </div>
  );
}
