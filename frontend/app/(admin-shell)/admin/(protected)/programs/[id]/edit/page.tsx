import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { adminApi } from '../../../../../../../lib/admin-api';
import { EditProgramClient } from '../../../../../../../components/admin/forms/EditProgramClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProgramPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')!.value;
  let program;
  try {
    program = await adminApi.programs.get(token, id);
  } catch {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Program</h1>
      <EditProgramClient program={program} />
    </div>
  );
}
