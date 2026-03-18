'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react'

type GalleryItem = {
  id: string
  type: 'photo' | 'video'
  url: string
  title: string | null
  created_at: string
  position: number
  likes: number
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
    const peertubeBase = url.split('/w/')[0]
    const videoId = url.split('/w/')[1].split('?')[0]
    return `${peertubeBase}/videos/embed/${videoId}`
  }
  return url
}

function getVideoProvider(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
  if (url.includes('odysee.com')) return 'Odysee'
  if (url.includes('/videos/watch/') || url.includes('/w/')) return 'PeerTube'
  return 'Video'
}

export default function GalleryPage() {
  const supabase = createClient()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [liked, setLiked] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('gallery_items')
        .select('*')
        .order('position', { ascending: true })
      setItems((data as GalleryItem[]) || [])
    }
    load()
    // Carica liked da localStorage
    const stored = localStorage.getItem('gallery_liked')
    if (stored) setLiked(new Set(JSON.parse(stored)))
  }, [])

  async function handleLike(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    if (liked.has(id)) return

    const res = await fetch('/api/gallery/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      const { likes } = await res.json()
      setItems(prev => prev.map(item => item.id === id ? { ...item, likes } : item))
      const newLiked = new Set(liked).add(id)
      setLiked(newLiked)
      localStorage.setItem('gallery_liked', JSON.stringify([...newLiked]))
    }
  }

  const photos = items.filter((i) => i.type === 'photo')
  const videos = items.filter((i) => i.type === 'video')

  function openLightbox(index: number) { setLightboxIndex(index) }
  function closeLightbox() { setLightboxIndex(null) }
  function prevPhoto() {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)
  }
  function nextPhoto() {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % photos.length)
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxIndex, photos.length])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-olive-800 mb-4">Gallery</h1>
        <div className="h-1 w-24 bg-gradient-to-r from-olive-400 to-honey-400 rounded-full mx-auto mb-6"></div>
        <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto italic">
          Ogni immagine racconta un pezzo del nostro uliveto: le piante secolari, i frutti, la terra di Cleto.
          Scatti e riprese fatti da noi, nel corso delle stagioni, per condividere quello che di solito
          resta solo tra le mani di chi lavora la terra.
        </p>
      </div>

      {/* Foto */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-olive-700 mb-6 flex items-center gap-2">
          <span>📷</span> Foto
        </h2>
        {photos.length === 0 ? (
          <p className="text-stone-500 italic">Nessuna foto disponibile.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow bg-white cursor-pointer"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title || 'Foto gallery'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                    <svg className="w-6 h-6 text-olive-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                {photo.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">{photo.title}</p>
                  </div>
                )}
                {/* Like button */}
                <button
                  onClick={(e) => handleLike(e, photo.id)}
                  className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shadow transition-all ${
                    liked.has(photo.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 text-stone-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${liked.has(photo.id) ? 'fill-white' : ''}`} />
                  {photo.likes > 0 && <span>{photo.likes}</span>}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Video */}
      <section>
        <h2 className="text-2xl font-bold text-olive-700 mb-6 flex items-center gap-2">
          <span>🎬</span> Video
        </h2>
        {videos.length === 0 ? (
          <p className="text-stone-500 italic">Nessun video disponibile.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white">
                <div className="aspect-video">
                  <iframe
                    src={getVideoEmbedUrl(video.url)}
                    title={video.title || 'Video gallery'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                  />
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {video.title && (
                      <p className="text-stone-700 font-medium">{video.title}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    {/* Like button video */}
                    <button
                      onClick={(e) => handleLike(e, video.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                        liked.has(video.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-stone-100 text-stone-500 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${liked.has(video.id) ? 'fill-white' : ''}`} />
                      {video.likes > 0 && <span>{video.likes}</span>}
                    </button>
                    <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
                      {getVideoProvider(video.url)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
            <X className="w-6 h-6" />
          </button>
          {photos.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); prevPhoto() }} className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].title || ''}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            <div className="flex items-center gap-4">
              {photos[lightboxIndex].title && (
                <p className="text-white text-sm font-medium">{photos[lightboxIndex].title}</p>
              )}
              <button
                onClick={(e) => handleLike(e, photos[lightboxIndex].id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  liked.has(photos[lightboxIndex].id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 text-white hover:bg-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked.has(photos[lightboxIndex].id) ? 'fill-white' : ''}`} />
                {photos[lightboxIndex].likes > 0 && <span>{photos[lightboxIndex].likes}</span>}
              </button>
            </div>
            <p className="text-white/50 text-xs">{lightboxIndex + 1} / {photos.length}</p>
          </div>
          {photos.length > 1 && (
            <button onClick={(e) => { e.stopPropagation(); nextPhoto() }} className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
