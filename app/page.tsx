import { createServerClient } from '@/lib/supabase-server'
import Hero from '@/components/Hero'
import PostCard from '@/components/PostCard'

export const revalidate = 60

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  created_at: string
  posts_tags?: Array<{ tags: { id: string; name: string; slug: string; color: string } }>
}

export default async function HomePage() {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('posts')
    .select(`
      *,
      posts_tags(tag_id, tags(id, name, slug, color))
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const posts = (data || []) as Post[]

  return (
    <>
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="articoli">
        <h2 className="text-3xl font-bold text-olive-800 mb-8">
          Ultimi Articoli
        </h2>

        {posts.length === 0 ? (
          <p className="text-stone-600 text-center py-12">
            Nessun articolo pubblicato
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
