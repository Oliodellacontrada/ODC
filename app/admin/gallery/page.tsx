'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Trash2, Image, Video, Plus } from 'lucide-react'

type GalleryItem = {
  id: string
  type: 'photo' | 'video'
  url: string
  title: string | null
  created_at: string
}

export default function AdminGalleryPage() {
  const supabase = createClient()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  async function loadItems() {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false })
    setItems((data as GalleryItem[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  async function handleAdd() {
    if (!url.trim()) return
    setSaving(true)
    setMessage(null)

    const { error } = await (supabase as any)
      .from('gallery_items')
      .insert({
        type: activeTab,
        url: url.trim(),
        title: title.trim() || null,
      })

    setSaving(false)
    if (error) {
      setMessage({ text: 'Errore durante il salvataggio.', ok: false })
    } else {
      setMessage({ text: 'Aggiunto con successo!', ok: true })
      setUrl('')
      setTitle('')
      loadItems()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Sei sicuro di voler eliminare questo elemento?')) return
    await (supabase as any).from('gallery_items').delete().eq('id', id)
    loadItems()
  }

  const photos = items.filter((i) => i.type === 'photo')
  const videos = items.filter((i) => i.type === 'video')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-olive-800 mb-8">Gestione Gallery</h1>

      {/* Form aggiunta */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-xl font-semibold text-olive-700 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Aggiungi elemento
        </h2>

        {/* Tab tipo */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'photo'
                ? 'bg-olive-600 text-white shadow'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Image className="w-4 h-4" /> Foto
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'video'
                ? 'bg-olive-600 text-white shadow'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Video className="w-4 h-4" /> Video
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              {activeTab === 'photo' ? 'URL Cloudinary' : 'URL YouTube'}
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={
                activeTab === 'photo'
                  ? 'https://res.cloudinary.com/...'
                  : 'https://www.youtube.com/watch?v=...'
              }
              className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-olive-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Titolo <span className="text-stone-400">(opzionale)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es. Raccolta 2024"
              className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-olive-400"
            />
          </div>

          {message && (
            <p className={`text-sm font-medium ${message.ok ? 'text-green-600' : 'text-red-500'}`}>
              {message.text}
            </p>
          )}

          <button
            onClick={handleAdd}
            disabled={saving || !url.trim()}
            className="bg-gradient-to-r from-olive-600 to-olive-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-olive-700 hover:to-olive-800 transition-all disabled:opacity-50"
          >
            {saving ? 'Salvataggio...' : 'Aggiungi'}
          </button>
        </div>
      </div>

      {/* Lista Foto */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-olive-700 mb-4 flex items-center gap-2">
          <span>📷</span> Foto ({photos.length})
        </h2>
        {loading ? (
          <p className="text-stone-400">Caricamento...</p>
        ) : photos.length === 0 ? (
          <p className="text-stone-400 italic">Nessuna foto aggiunta.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group rounded-xl overflow-hidden shadow bg-white">
                <div className="aspect-square">
                  <img
                    src={photo.url}
                    alt={photo.title || ''}
                    className="w-full h-full object-cover"
                  />
                </div>
                {photo.title && (
                  <p className="text-xs text-stone-600 px-2 py-1 truncate">{photo.title}</p>
                )}
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lista Video */}
      <section>
        <h2 className="text-2xl font-bold text-olive-700 mb-4 flex items-center gap-2">
          <span>🎬</span> Video ({videos.length})
        </h2>
        {loading ? (
          <p className="text-stone-400">Caricamento...</p>
        ) : videos.length === 0 ? (
          <p className="text-stone-400 italic">Nessun video aggiunto.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="relative group rounded-xl overflow-hidden shadow bg-white">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${new URL(video.url).searchParams.get('v') || video.url.split('/').pop()}`}
                    title={video.title || 'Video'}
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                {video.title && (
                  <p className="text-sm text-stone-600 px-3 py-2 font-medium">{video.title}</p>
                )}
                <button
                  onClick={() => handleDelete(video.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
