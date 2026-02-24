import { redirect } from 'next/navigation';
import { getSuperAdminUser } from '@/lib/super-admin';
import AdminNav from './AdminNav';

export const metadata = { title: 'Super Admin' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSuperAdminUser();
  if (!user) redirect('/');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-indigo-600 font-bold text-xl">◆</span>
        <div>
          <h1 className="font-outfit font-bold text-xl text-stone-900 leading-none">Super Admin</h1>
          <p className="text-xs text-stone-400 mt-0.5">{user.email}</p>
        </div>
      </div>
      <AdminNav />
      <div className="mt-6">{children}</div>
    </div>
  );
}
