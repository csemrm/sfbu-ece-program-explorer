'use client';

import { useRouter } from 'next/navigation';
import { KaForm } from './KaForm';
import type { AdminKnowledgeArea } from '../../../lib/admin-api';
import { adminApi } from '../../../lib/admin-api';

export function EditKaClient({ ka }: { ka: AdminKnowledgeArea }) {
  const router = useRouter();

  async function handleUpdate(data: { name: string; description: string }) {
    const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
    await adminApi.knowledgeAreas.update(token, ka.id, data);
    router.push('/admin/knowledge-areas');
    router.refresh();
  }

  return <KaForm initial={ka} onSubmit={handleUpdate} submitLabel="Update Knowledge Area" />;
}
