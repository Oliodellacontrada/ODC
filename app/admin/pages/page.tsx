import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Edit2 } from 'lucide-react'

type Page = {
  id: string
  title: string
  slug: string
  content: string
}

export default async function AdminPagesPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { data } = await supabase
    .from('pages')
    .select('*')
    .order('title')

  const pages = (data || []) as Page[]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-olive-800">
          Gestione Pagine
        </h1>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuova Pagina
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {pages.map((page) => (
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
