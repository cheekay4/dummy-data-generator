import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin'
import AdminNav from './AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser()
  if (!admin) redirect('/')

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-stone-800">管理者ダッシュボード</h1>
            <p className="text-xs text-stone-400 mt-0.5">{admin.email}</p>
          </div>
        </div>
        <AdminNav />
        {children}
      </div>
    </div>
  )
}
