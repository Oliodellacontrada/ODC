import { createServerClient } from '@/lib/supabase-server'
import Hero from '@/components/Hero'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export const revalidate = 60

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  created_at: string
  type: string
  youtube_url: string | null
  posts_tags?: Array<{ tags: { id: string; name: string; slug: string; color: string } }>
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default async function HomePage() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('posts')
    .select(`*, posts_tags(tag_id, tags(id, name, slug, color))`)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const posts = (data || []) as Post[]
  const articoli = posts.filter(p => p.type === 'articolo' || !p.type).slice(0, 3)
  const video = posts.filter(p => p.type === 'video').slice(0, 3)

  return (
    <>
      <Hero />

      {/* Ultimi Articoli */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="articoli">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-olive-800">Ultimi Articoli</h2>
        </div>
        {articoli.length === 0 ? (
          <p className="text-stone-600 text-center py-12">Nessun articolo pubblicato</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articoli.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Ultimi Video */}
      {video.length > 0 && (
        <div className="bg-stone-50 border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="video">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-olive-800">Ultimi Video</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {video.map((post) => {
                const ytId = post.youtube_url ? getYoutubeId(post.youtube_url) : null
                const thumbnail = post.cover_image_url || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null)
                return (
                  <Link
                    key={post.id}
                    href={`/post/${post.slug}`}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-stone-100"
                  >
                    <div className="relative aspect-video overflow-hidden bg-stone-200">
                      {thumbnail && (
                        <img
                          src={thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-olive-800 text-lg mb-2 group-hover:text-olive-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-stone-500 text-sm line-clamp-2">{post.excerpt}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
