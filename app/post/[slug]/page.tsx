import { createServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

type Post = {
  id: string
  title: string
  slug: string
  content: string
  cover_image_url: string | null
  published_at: string | null
  created_at: string
  meta_title: string | null
  meta_description: string | null
  posts_tags?: Array<{ tags: { id: string; name: string; slug: string; color: string } }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('posts')
    .select('title, meta_title, meta_description, cover_image_url')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!data) return {}

  const post = data as Post

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || '',
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || '',
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('posts')
    .select(`
      *,
      posts_tags(tag_id, tags(id, name, slug, color))
    `)
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!data) notFound()

  const post = data as Post
  const tags = post.posts_tags?.map((pt) => pt.tags) || []

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {post.cover_image_url && (
        <div className="relative h-96 rounded-lg overflow-hidden mb-8">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </span>
        ))}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-olive-800 mb-4">
        {post.title}
      </h1>

      <p className="text-stone-500 mb-8">
        {formatDate(post.published_at || post.created_at)}
      </p>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
