import { createServerClient } from '@/lib/supabase-server'
import Hero from '@/components/Hero'
import PostCard from '@/components/PostCard'
import VideoCard from '@/components/VideoCard'
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
          <Link href="/blog" className="text-olive-700 font-semibold hover:text-olive-900 transition-colors">
            Vedi tutti →
          </Link>
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
              <Link href="/video" className="text-olive-700 font-semibold hover:text-olive-900 transition-colors">
                Vedi tutti →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {video.map((post) => (
                <VideoCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
