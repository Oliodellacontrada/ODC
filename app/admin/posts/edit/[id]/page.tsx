import { createServerClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import PostForm from '@/components/admin/PostForm'

type Props = {
  params: { id: string }
}

export default async function EditPostPage({ params }: Props) {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      posts_tags(tag_id)
    `)
    .eq('id', params.id)
    .single()

  if (!post) notFound()

  const { data: tags } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  const selectedTagIds = post.posts_tags?.map((pt: any) => pt.tag_id) || []

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-olive-800 mb-8">
        Modifica Post
      </h1>

      <PostForm 
        post={post} 
        tags={tags || []}
        selectedTagIds={selectedTagIds}
      />
    </div>
  )
}
