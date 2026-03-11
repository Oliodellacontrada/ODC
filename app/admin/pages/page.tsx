'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit2, Trash2 } from 'lucide-react'

type Page = {
  id: string
  title: string
  slug: string
  content: string
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadPages() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      const { data } = await supabase
        .from('pages')
        .select('*')
        .order('title')
      setPages((data || []) as Page[])
    }
    loadPages()
  }, [])

  async function handleDelete(id: string) {
    setDeletingId(id)
    await supabase.from('pages').delete().eq('id', id)
    setPages(pages.filter(p => p.id !== id))
    setDeletingId(null)
    setConfirmId(null)
  }

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
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/pages/edit/${page.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Modifica
              </Link>

              {confirmId === page.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-600">Sicuro?</span>
                  <button
                    onClick={() => handleDelete(page.id)}
                    disabled={deletingId === page.id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                  >
                    {deletingId === page.id ? 'Eliminando...' : 'Conferma'}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors text-sm"
                  >
                    Annulla
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(page.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Elimina
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
