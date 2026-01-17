import { createServerClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import PageForm from '@/components/admin/PageForm'

type Props = {
  params: { id: string }
}

type Page = {
  id: string
  title: string
  slug: string
  content: string
  created_at: string
  updated_at: string
}

export default async function EditPagePage({ params }: Props) {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!data) notFound()

  const page = data as Page

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-olive-800 mb-8">
        Modifica: {page.title}
      </h1>

      <PageForm page={page} />
    </div>
  )
}
