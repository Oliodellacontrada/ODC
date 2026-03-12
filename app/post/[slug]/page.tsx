import { createServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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

  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const readingMinutes = Math.max(1, Math.round(wordCount / 150))

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-olive-50/30 to-sage-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Torna al blog */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-olive-600 hover:text-olive-800 transition-colors mb-8 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Torna al blog
        </Link>

        <article>
          {/* Immagine di copertina */}
          {post.cover_image_url && (
            <div className="relative h-96 rounded-3xl overflow-hidden mb-10 shadow-xl">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-stone-400" />
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-full text-sm font-medium text-white shadow-sm"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Titolo */}
          <h1 className="text-4xl md:text-5xl font-bold text-olive-800 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 text-stone-500 mb-10 pb-8 border-b-2 border-olive-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-olive-100 rounded-lg">
                <Calendar className="w-4 h-4 text-olive-600" />
              </div>
              <span className="text-sm font-medium">
                {formatDate(post.published_at || post.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-olive-100 rounded-lg">
                <Clock className="w-4 h-4 text-olive-600" />
              </div>
              <span className="text-sm font-medium">
                {readingMinutes} min di lettura
              </span>
            </div>
          </div>

          {/* Contenuto */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-olive-800 prose-a:text-olive-600 prose-strong:text-olive-900 prose-p:text-stone-700 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer articolo */}
          <div className="mt-16 pt-8 border-t-2 border-olive-100">
            <div className="bg-gradient-to-br from-olive-600 to-olive-700 rounded-3xl p-8 text-white text-center shadow-xl">
              <p className="text-olive-100 mb-2 text-sm font-medium">Scritto con cura da</p>
              <p className="text-2xl font-bold mb-4">Olio della Contrada</p>
              <p className="text-olive-200 text-sm leading-relaxed max-w-md mx-auto">
                Produttori di olio extravergine biologico monocultivar Carolea, dalle colline di Cleto in Calabria.
              </p>
              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-olive-700 font-semibold rounded-xl hover:bg-olive-50 transition-colors shadow"
              >
                Contattaci
              </Link>
            </div>
          </div>

        </article>
      </div>
    </div>
  )
}
