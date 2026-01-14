import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

type PostCardProps = {
  post: any
}

export default function PostCard({ post }: PostCardProps) {
  const tags = post.posts_tags?.map((pt: any) => pt.tags) || []

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
    >
      {post.cover_image_url && (
        <div className="relative h-48 bg-stone-200">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag: any) => (
            <span
              key={tag.id}
              className="px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-semibold text-olive-800 mb-2 group-hover:text-olive-600 transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-stone-600 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <p className="text-stone-500 text-sm">
          {formatDate(post.published_at || post.created_at)}
        </p>
      </div>
    </Link>
  )
}
