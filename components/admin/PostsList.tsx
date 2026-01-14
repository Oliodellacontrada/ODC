'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

type Post = {
  id: string
  title: string
  slug: string
  status: string
  published_at: string | null
  created_at: string
  posts_tags?: Array<{ tags: { name: string; color: string } }>
}

export default function PostsList({ posts }: { posts: Post[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Eliminare "${title}"?`)) return

    setDeleting(id)
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw error
      router.refresh()
    } catch (error) {
      alert('Errore durante l\'eliminazione')
    } finally {
      setDeleting(null)
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-stone-600">
        Nessun post presente. Crea il tuo primo post!
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-stone-200">
        <thead className="bg-stone-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
              Titolo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
              Tags
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
              Stato
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
              Data
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase">
              Azioni
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-stone-200">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-olive-800">
                  {post.title}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {post.posts_tags?.map((pt, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-full text-xs text-white"
                      style={{ backgroundColor: pt.tags.color }}
                    >
                      {pt.tags.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  post.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.status === 'published' ? 'Pubblicato' : 'Bozza'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                {formatDate(post.published_at || post.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/posts/edit/${post.id}`}
                    className="text-olive-600 hover:text-olive-900"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deleting === post.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
