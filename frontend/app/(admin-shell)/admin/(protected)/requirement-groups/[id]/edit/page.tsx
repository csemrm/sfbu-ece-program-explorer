import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { adminApi } from '../../../../../../../lib/admin-api';
import { EditRgClient } from '../../../../../../../components/admin/forms/EditRgClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRgPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value ?? '';
  try {
    const [rg, catalogYears] = await Promise.all([
      adminApi.requirementGroups.get(token, id),
      adminApi.catalogYears.list(token),
    ]);
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Requirement Group
        </h1>
        <EditRgClient rg={rg} catalogYears={catalogYears} />
      </div>
    );
  } catch {
    notFound();
  }
}
