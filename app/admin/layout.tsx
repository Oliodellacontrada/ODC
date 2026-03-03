'use client'

import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/admin/LogoutButton'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <div className="min-h-screen bg-stone-50">
      {!isLoginPage && (
        <div className="bg-olive-800 text-white px-6 py-2 flex justify-between items-center text-sm">
          <span className="font-medium text-olive-200">Pannello Admin</span>
          <form action="/admin/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 bg-olive-700 hover:bg-olive-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </form>
        </div>
      )}
      {children}
    </div>
  )
}
