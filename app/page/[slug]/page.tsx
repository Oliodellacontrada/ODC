import { createServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'

type Props = {
  params: { slug: string }
}

type Page = {
  id: string
  title: string
  slug: string
  content: string
}

export default async function PageSlug({ params }: Props) {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!data) notFound()

  const page = data as Page

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-olive-800 mb-8">
        {page.title}
      </h1>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  )
}
