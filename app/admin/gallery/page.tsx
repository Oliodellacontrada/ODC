'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Trash2, Image, Video, Plus } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type GalleryItem = {
  id: string
  type: 'photo' | 'video'
  url: string
  title: string | null
  created_at: string
  position: number
}

function getVideoEmbedUrl(url: string): string {
  const ytRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const ytMatch = url.match(ytRegExp)
  if (ytMatch && ytMatch[7].length === 11) {
    return `https://www.youtube.com/embed/${ytMatch[7]}`
  }
  if (url.includes('odysee.com')) {
    return url.replace('odysee.com/', 'odysee.com/$/embed/')
  }
  if (url.includes('/videos/watch/')) {
    return url.replace('/videos/watch/', '/videos/embed/')
  }
  if (url.match(/\/w\/[a-zA-Z0-9]+/)) {
    const base = url.split('/w/')[0]
    const videoId = url.split('/w/')[1].split('?')[0]
    return `${base}/videos/embed/${videoId}`
  }
  return url
}

function getVideoProvider(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
  if (url.includes('odysee.com')) return 'Odysee'
  if (url.includes('/videos/watch/') || url.match(/\/w\/[a-zA-Z0-9]+/)) return 'PeerTube'
  return 'Video'
}

function SortablePhoto({ photo, onDelete }: { photo: GalleryItem; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-xl overflow-hidden shadow bg-white"
    >
      <div
        {...attributes}
        {...listeners}
        className="aspect-square cursor-grab active:cursor-grabbing"
      >
        <img
          src={photo.url}
          alt={photo.title || ''}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full p-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>
      </div>
      {photo.title && (
        <p className="text-xs text-stone-600 px-2 py-1 truncate">{photo.title}</p>
      )}
      <button
        onClick={() => onDelete(photo.id)}
        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  async function loadItems() {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('position', { ascending: true })
    setItems((data as GalleryItem[]) || [])
    setLoading(false)
  }

  useEffect(() => { loadItems() }, [])

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
        position: items.filter(i => i.type === activeTab).length,
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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const photos = items.filter(i => i.type === 'photo')
    const others = items.filter(i => i.type !== 'photo')

    const oldIndex = photos.findIndex(p => p.id === active.id)
    const newIndex = photos.findIndex(p => p.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(photos, oldIndex, newIndex)
    const updated = reordered.map((item, index) => ({ ...item, position: index }))
    setItems([...others, ...updated])

    for (const item of updated) {
      await (supabase as any).from('gallery_items').update({ position: item.position }).eq('id', item.id)
    }
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
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setActiveTab('photo'); setUrl(''); setMessage(null) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'photo' ? 'bg-olive-600 text-white shadow' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Image className="w-4 h-4" /> Foto
          </button>
          <button
            onClick={() => { setActiveTab('video'); setUrl(''); setMessage(null) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'video' ? 'bg-olive-600 text-white shadow' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Video className="w-4 h-4" /> Video
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              {activeTab === 'photo' ? 'URL Cloudinary' : 'URL Video (YouTube, Odysee, PeerTube)'}
            </label>
            {activeTab === 'video' && (
              <p className="text-xs text-stone-400 mb-2">
                Esempi: youtube.com/watch?v=... · odysee.com/@canale/video · peertube.esempio.com/videos/watch/UUID
              </p>
            )}
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={activeTab === 'photo' ? 'https://res.cloudinary.com/...' : 'https://www.youtube.com/watch?v=...'}
              className="w-full border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-olive-400"
            />
            {activeTab === 'video' && url && (
              <p className="text-xs text-olive-600 mt-1 font-medium">
                Provider rilevato: {getVideoProvider(url)}
              </p>
            )}
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
        <h2 className="text-2xl font-bold text-olive-700 mb-2 flex items-center gap-2">
          <span>📷</span> Foto ({photos.length})
        </h2>
        <p className="text-xs text-stone-400 mb-4">Trascina le foto per riordinarle</p>
        {loading ? (
          <p className="text-stone-400">Caricamento...</p>
        ) : photos.length === 0 ? (
          <p className="text-stone-400 italic">Nessuna foto aggiunta.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={photos.map(p => p.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <SortablePhoto key={photo.id} photo={photo} onDelete={handleDelete} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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
                    src={getVideoEmbedUrl(video.url)}
                    title={video.title || 'Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  {video.title && (
                    <p className="text-sm text-stone-600 font-medium truncate">{video.title}</p>
                  )}
                  <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full ml-auto shrink-0">
                    {getVideoProvider(video.url)}
                  </span>
                </div>
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
