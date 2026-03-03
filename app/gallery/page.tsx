import { createServerClient } from '@/lib/supabase-server'

type GalleryItem = {
  id: string
  type: 'photo' | 'video'
  url: string
  title: string | null
  created_at: string
}

function getYoutubeEmbedUrl(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = match && match[7].length === 11 ? match[7] : null
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

export default async function GalleryPage() {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false })

  const items = (data as GalleryItem[]) || []
  const photos = items.filter((i) => i.type === 'photo')
  const videos = items.filter((i) => i.type === 'video')

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
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow bg-white"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title || 'Foto gallery'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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
                    src={getYoutubeEmbedUrl(video.url)}
                    title={video.title || 'Video gallery'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                {video.title && (
                  <div className="p-3">
                    <p className="text-stone-700 font-medium">{video.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
