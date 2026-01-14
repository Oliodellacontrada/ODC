import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import PostForm from '@/components/admin/PostForm'

export default async function NewPostPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { data: tags } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-olive-800 mb-8">
        Nuovo Post
      </h1>

      <PostForm tags={tags || []} />
    </div>
  )
}
