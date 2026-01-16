import { createServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import PageContent from '@/components/PageContent'

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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-olive-50/30 to-sage-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header della pagina */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-olive-100 to-sage-100 rounded-full mb-4 border-2 border-olive-300">
            <span className="text-olive-700 font-semibold text-sm">
              📄 Pagina Informativa
            </span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-olive-800 to-olive-600 bg-clip-text text-transparent">
            {page.title}
          </h1>
        </div>

        {/* Contenuto */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-olive-200 p-8 md:p-12">
          <PageContent content={page.content} />
        </div>
      </div>
    </div>
  )
}
