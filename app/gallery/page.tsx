'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

type GalleryItem = {
  id: string
  type: 'photo' | 'video'
  url: string
  title: string | null
  created_at: string
}

function getVideoEmbedUrl(url: string): string {
  // YouTube
  const ytRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const ytMatch = url.match(ytRegExp)
  if (ytMatch && ytMatch[7].length === 11) {
    return `https://www.youtube.com/embed/${ytMatch[7]}`
  }

  // Odysee - es: https://odysee.com/@canale/video-slug
  if (url.includes('odysee.com')) {
    // Converte URL normale in embed
    const odyseeEmbed = url.replace('odysee.com/', 'odysee.com/$/embed/')
    return odyseeEmbed
  }

  // PeerTube - es: https://peertube.esempio.com/videos/watch/UUID
  if (url.includes('/videos/watch/')) {
    return url.replace('/videos/watch/', '/videos/embed/')
  }

  // PeerTube formato alternativo: /w/UUID
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

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false })
      setItems((data as GalleryItem[]) || [])
    }
    load()
  }, [])

  const photos = items.filter((i) => i.type === 'photo')
  const videos = items.filter((i) => i.type === 'video')

  function openLightbox(index: number) {
    setLightboxIndex(index)
  }

  function closeLightbox() {
    setLightboxIndex(null)
  }

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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-olive-800 mb-4">Gallery</h1>
        <div className="h-1 w-24 bg-gradient-to-r from-olive-400 to-honey-400 rounded-full mx-auto"></div>
      </div>

      {/* Sezione Foto */}
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
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sezione Video */}
      <section>
        <h2 className="text-2xl font-bold text-olive-700 mb-6 flex items-center gap-2">
          <span>🎬</span> Video
        </h2>
        {videos.length === 0 ? (
          <p className="text-stone-500 italic">Nessun video disponibile.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white">
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
                  {video.title && (
                    <p className="text-stone-700 font-medium">{video.title}</p>
                  )}
                  <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full ml-auto">
                    {getVideoProvider(video.url)}
                  </span>
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
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto() }}
              className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightboxIndex].url}
              alt={photos[lightboxIndex].title || ''}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            {photos[lightboxIndex].title && (
              <p className="text-white text-sm font-medium">{photos[lightboxIndex].title}</p>
            )}
            <p className="text-white/50 text-xs">{lightboxIndex + 1} / {photos.length}</p>
          </div>

          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto() }}
              className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
