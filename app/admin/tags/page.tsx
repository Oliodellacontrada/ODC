import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import TagsList from '@/components/admin/TagsList'
import TagForm from '@/components/admin/TagForm'

export default async function AdminTagsPage() {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-olive-800 mb-8">
        Gestione Tags
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-olive-700 mb-4">
            Nuovo Tag
          </h2>
          <TagForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-olive-700 mb-4">
            Tags Esistenti
          </h2>
          <TagsList tags={tags || []} />
        </div>
      </div>
    </div>
  )
}
