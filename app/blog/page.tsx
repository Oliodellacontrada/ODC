import { createServerClient } from '@/lib/supabase-server'
import PostCard from '@/components/PostCard'

export const revalidate = 60

export const metadata = {
  title: 'Blog',
  description: 'Tutti gli articoli di Olio della Contrada',
}

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  created_at: string
  type: string
  posts_tags?: Array<{ tags: { id: string; name: string; slug: string; color: string } }>
}

export default async function BlogPage() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('posts')
    .select(`*, posts_tags(tag_id, tags(id, name, slug, color))`)
    .eq('status', 'published')
    .eq('type', 'articolo')
    .order('published_at', { ascending: false })

  const posts = (data || []) as Post[]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-olive-800 mb-3">Blog</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-olive-400 to-honey-400 rounded-full mb-4"></div>
        <p className="text-stone-600 text-lg">
          Storie dalla campagna, curiosità sull&apos;olio e tradizioni calabresi.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-stone-500 text-center py-20 italic">Nessun articolo pubblicato.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
