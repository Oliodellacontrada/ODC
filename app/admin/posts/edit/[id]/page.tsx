import { createServerClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import PostForm from '@/components/admin/PostForm'

type Props = {
  params: { id: string }
}

type Post = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image_url: string | null
  status: string
  meta_title: string
  meta_description: string
  posts_tags?: Array<{ tag_id: string }>
}

type Tag = {
  id: string
  name: string
  slug: string
  color: string
}

export default async function EditPostPage({ params }: Props) {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { data: postData } = await supabase
    .from('posts')
    .select(`
      *,
      posts_tags(tag_id)
    `)
    .eq('id', params.id)
    .single()

  if (!postData) notFound()

  const post = postData as Post

  const { data: tagsData } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  const tags = (tagsData || []) as Tag[]
  const selectedTagIds = post.posts_tags?.map((pt) => pt.tag_id) || []

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-olive-800 mb-8">
        Modifica Post
      </h1>

      <PostForm 
        post={post} 
        tags={tags}
        selectedTagIds={selectedTagIds}
      />
    </div>
  )
}
