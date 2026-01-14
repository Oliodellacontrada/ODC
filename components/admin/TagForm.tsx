'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { generateSlug } from '@/lib/utils'

export default function TagForm() {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#8d9f67')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = generateSlug(name)

      const { error } = await supabase
        .from('tags')
        .insert([{ name, slug, color }])

      if (error) throw error

      setName('')
      setColor('#8d9f67')
      router.refresh()
    } catch (error: any) {
      alert(error.message || 'Errore durante la creazione del tag')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Nome Tag *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
          placeholder="es. Olive, Ricette, Tradizione"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Colore
        </label>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-20 rounded cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
          <div
            className="px-4 py-2 rounded-lg text-white font-medium"
            style={{ backgroundColor: color }}
          >
            Anteprima
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Creazione...' : 'Crea Tag'}
      </button>
    </form>
  )
}
