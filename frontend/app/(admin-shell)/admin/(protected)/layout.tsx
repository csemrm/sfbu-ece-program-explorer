import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminApi } from '../../../../lib/admin-api';
import { AdminSidebar } from '../../../../components/admin/AdminSidebar';
import { ThemeToggle } from '../../../../components/admin/ThemeToggle';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) redirect('/admin/login');

  let user: { id: string; email: string; role: string };
  try {
    user = await adminApi.auth.me(token);
  } catch {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar email={user.email} />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-xs bg-blue-50 text-sfbu-navy dark:bg-white/10 dark:text-gray-300 rounded-full px-2.5 py-1 font-medium">
              {user.role.replace(/_/g, ' ')}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{user.email}</span>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
