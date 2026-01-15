'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Trash2, Edit2, Check, X } from 'lucide-react'

type Tag = {
  id: string
  name: string
  slug: string
  color: string
}

export default function TagsList({ tags }: { tags: Tag[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Eliminare il tag "${name}"?`)) return

    setDeleting(id)
    try {
      const { error } = await (supabase.from('tags') as any).delete().eq('id', id)
      if (error) throw error
      router.refresh()
    } catch (error) {
      alert('Errore durante l\'eliminazione')
    } finally {
      setDeleting(null)
    }
  }

  function startEdit(tag: Tag) {
    setEditing(tag.id)
    setEditName(tag.name)
    setEditColor(tag.color)
  }

  function cancelEdit() {
    setEditing(null)
    setEditName('')
    setEditColor('')
  }

  async function saveEdit(id: string) {
    try {
      const { error } = await (supabase.from('tags') as any)
        .update({ name: editName, color: editColor })
        .eq('id', id)

      if (error) throw error

      setEditing(null)
      router.refresh()
    } catch (error) {
      alert('Errore durante il salvataggio')
    }
  }

  if (tags.length === 0) {
    return (
      <div className="text-center py-8 text-stone-600 bg-white rounded-lg shadow p-6">
        Nessun tag presente
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-stone-200">
      {tags.map((tag) => (
        <div key={tag.id} className="p-4">
          {editing === tag.id ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  className="h-10 w-16 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(tag.id)}
                  className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-2 bg-stone-400 text-white rounded hover:bg-stone-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
                <span className="text-sm text-stone-500">{tag.color}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(tag)}
                  className="p-2 text-olive-600 hover:bg-olive-50 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(tag.id, tag.name)}
                  disabled={deleting === tag.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
