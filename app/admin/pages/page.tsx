import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Edit2 } from 'lucide-react'

export default async function AdminPagesPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('title')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-olive-800 mb-8">
        Gestione Pagine
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {pages?.map((page) => (
          <div
            key={page.id}
            className="p-6 border-b border-stone-200 last:border-b-0 flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-olive-800">
                {page.title}
              </h3>
              <p className="text-sm text-stone-600 mt-1">
                /{page.slug}
              </p>
            </div>
            <Link
              href={`/admin/pages/edit/${page.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Modifica
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
