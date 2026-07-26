import Link from 'next/link'

type VideoCardProps = {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    cover_image_url: string | null
    youtube_url: string | null
  }
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default function VideoCard({ post }: VideoCardProps) {
  const ytId = post.youtube_url ? getYoutubeId(post.youtube_url) : null
  const thumbnail = post.cover_image_url || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null)

  return (
    <Link
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
}
