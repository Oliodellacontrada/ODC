import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import PostsList from '@/components/admin/PostsList'

export default async function AdminPostsPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      posts_tags(tag_id, tags(name, color))
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-olive-800">
          Gestione Post
        </h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuovo Post
        </Link>
      </div>

      <PostsList posts={posts || []} />
    </div>
  )
}
