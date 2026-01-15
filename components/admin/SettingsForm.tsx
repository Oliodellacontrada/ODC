'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'

type Settings = {
  id: string
  logo_url: string | null
  hero_image_url: string | null
  site_title: string | null
  site_description: string | null
  google_analytics_id: string | null
}

export default function SettingsForm({ settings }: { settings: Settings | null }) {
  const [logo, setLogo] = useState(settings?.logo_url || '')
  const [heroImage, setHeroImage] = useState(settings?.hero_image_url || '')
  const [title, setTitle] = useState(settings?.site_title || 'Olio della Contrada')
  const [description, setDescription] = useState(settings?.site_description || '')
  const [analyticsId, setAnalyticsId] = useState(settings?.google_analytics_id || '')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData = {
        logo_url: logo || null,
        hero_image_url: heroImage || null,
        site_title: title,
        site_description: description,
        google_analytics_id: analyticsId || null,
      }

      const { error } = await supabase
        .from('site_settings')
        .update(updateData)
        .eq('id', settings?.id)

      if (error) throw error

      router.refresh()
      alert('Impostazioni salvate con successo!')
    } catch (error: any) {
      alert(error.message || 'Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold text-olive-700">
          Brand e Identità
        </h2>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Logo
          </label>
          <ImageUpload value={logo} onChange={setLogo} />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Immagine Hero
          </label>
          <ImageUpload value={heroImage} onChange={setHeroImage} />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Titolo Sito
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Descrizione Sito
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold text-olive-700">
          Analytics
        </h2>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={analyticsId}
            onChange={(e) => setAnalyticsId(e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
          <p className="text-sm text-stone-500 mt-1">
            Inserisci il tuo ID di Google Analytics (es. G-XXXXXXXXXX)
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvataggio...' : 'Salva Impostazioni'}
        </button>
      </div>
    </form>
  )
}
