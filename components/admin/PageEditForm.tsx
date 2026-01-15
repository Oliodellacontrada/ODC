'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import TiptapEditor from './TiptapEditor'

type Page = {
  id: string
  title: string
  slug: string
  content: string
}

export default function PageEditForm({ page }: { page: Page }) {
  const [title, setTitle] = useState(page.title)
  const [content, setContent] = useState(page.content)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('pages')
        .update({ title, content })
        .eq('id', page.id)

      if (error) throw error

      router.push('/admin/pages')
      router.refresh()
    } catch (error: any) {
      alert(error.message || 'Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Titolo
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Contenuto
          </label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvataggio...' : 'Salva'}
        </button>
      </div>
    </form>
  )
}
