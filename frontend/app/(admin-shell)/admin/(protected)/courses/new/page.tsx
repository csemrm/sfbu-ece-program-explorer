'use client';

import { useRouter } from 'next/navigation';
import { CourseForm } from '../../../../../../components/admin/forms/CourseForm';
import { adminApi } from '../../../../../../lib/admin-api';

export default function NewCoursePage() {
  const router = useRouter();

  async function handleCreate(data: {
    courseCode: string;
    title: string;
    description: string;
    creditHours: number;
    level: string;
  }) {
    const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
    await adminApi.courses.create(token, data);
    router.push('/admin/courses');
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">New Course</h1>
      <CourseForm onSubmit={handleCreate} submitLabel="Create Course" />
    </div>
  );
}
