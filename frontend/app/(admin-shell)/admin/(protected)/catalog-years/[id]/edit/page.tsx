import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '../../../../../../../lib/admin-api';
import { EditCyClient } from '../../../../../../../components/admin/forms/EditCyClient';

export default async function EditCatalogYearPage({ params }: { params: { id: string } }) {
  const token = (await cookies()).get('admin_token')?.value ?? '';

  let cy;
  let programs;
  try {
    [cy, programs] = await Promise.all([
      adminApi.catalogYears.get(token, params.id),
      adminApi.programs.list(token, 1).then((r) => r.data),
    ]);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/admin/catalog-years" className="hover:text-gray-800">
          Catalog Years
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Edit {cy.academicYear}</span>
      </nav>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Catalog Year</h1>
      <EditCyClient cy={cy} programs={programs} />
    </div>
  );
}
