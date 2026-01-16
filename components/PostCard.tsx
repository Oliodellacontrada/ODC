import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Calendar, ArrowRight } from 'lucide-react'

type PostCardProps = {
  post: any
}

export default function PostCard({ post }: PostCardProps) {
  const tags = post.posts_tags?.map((pt: any) => pt.tags) || []

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-olive-200 hover:border-olive-400 transform hover:-translate-y-2"
    >
      {/* Immagine con overlay */}
      {post.cover_image_url ? (
        <div className="relative h-56 bg-gradient-to-br from-olive-100 to-sage-100 overflow-hidden">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
          
          {/* Tags sovrapposti all'immagine */}
          {tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {tags.slice(0, 2).map((tag: any) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-md shadow-lg"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-stone-600/80 backdrop-blur-md">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="h-56 bg-gradient-to-br from-olive-200 via-sage-200 to-honey-100 flex items-center justify-center">
          <svg className="w-20 h-20 text-olive-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Contenuto */}
      <div className="p-6 bg-gradient-to-br from-white to-olive-50/30">
        {/* Data */}
        <div className="flex items-center gap-2 text-stone-500 text-sm mb-3">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(post.published_at || post.created_at)}</span>
        </div>

        {/* Titolo */}
        <h3 className="text-xl font-bold text-olive-800 mb-3 group-hover:text-olive-600 transition-colors line-clamp-2 leading-tight">
          {post.title}
        </h3>

        {/* Estratto */}
        {post.excerpt && (
          <p className="text-stone-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Footer card */}
        <div className="flex items-center justify-between pt-4 border-t border-olive-200">
          <span className="text-olive-600 font-semibold text-sm">Leggi l'articolo</span>
          <ArrowRight className="w-5 h-5 text-olive-600 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
