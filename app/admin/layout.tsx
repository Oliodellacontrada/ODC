import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-olive-800 text-white px-6 py-2 flex justify-between items-center text-sm">
        <span className="font-medium text-olive-200">Pannello Admin</span>
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 bg-olive-700 hover:bg-olive-600 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </form>
      </div>
      {children}
    </div>
  )
}
