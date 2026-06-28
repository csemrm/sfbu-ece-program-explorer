'use client';

import { adminApi, type AdminCourse } from '../../../lib/admin-api';
import { CourseForm } from './CourseForm';

export function EditCourseClient({ course }: { course: AdminCourse }) {
  async function handleUpdate(data: {
    courseCode: string;
    title: string;
    description: string;
    creditHours: number;
    level: string;
  }) {
    const token = document.cookie.match(/admin_token=([^;]+)/)?.[1] ?? '';
    await adminApi.courses.update(token, course.id, data);
  }

  return <CourseForm initial={course} onSubmit={handleUpdate} submitLabel="Save Changes" />;
}
