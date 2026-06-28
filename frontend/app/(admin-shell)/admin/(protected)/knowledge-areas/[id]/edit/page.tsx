import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { adminApi } from '../../../../../../../lib/admin-api';
import { EditKaClient } from '../../../../../../../components/admin/forms/EditKaClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditKaPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  let ka;
  try {
    ka = await adminApi.knowledgeAreas.get(token, id);
  } catch {
    notFound();
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Knowledge Area</h1>
      <EditKaClient ka={ka!} />
    </div>
  );
}
