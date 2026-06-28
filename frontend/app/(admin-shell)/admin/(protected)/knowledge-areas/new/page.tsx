'use client';

import { useRouter } from 'next/navigation';
import { KaForm } from '../../../../../../components/admin/forms/KaForm';
import { adminApi } from '../../../../../../lib/admin-api';

export default function NewKaPage() {
  const router = useRouter();

  async function handleCreate(data: { name: string; description: string }) {
    const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
    await adminApi.knowledgeAreas.create(token, data);
    router.push('/admin/knowledge-areas');
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Knowledge Area</h1>
      <KaForm onSubmit={handleCreate} submitLabel="Create Knowledge Area" />
    </div>
  );
}
