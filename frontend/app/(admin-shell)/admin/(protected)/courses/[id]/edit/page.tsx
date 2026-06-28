import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { adminApi } from '../../../../../../../lib/admin-api';
import { EditCourseClient } from '../../../../../../../components/admin/forms/EditCourseClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')!.value;
  let course;
  try {
    course = await adminApi.courses.get(token, id);
  } catch {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Course</h1>
      <EditCourseClient course={course} />
    </div>
  );
}
