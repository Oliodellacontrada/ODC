import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import PageForm from '@/components/admin/PageForm'

export default async function NewPagePage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-olive-800 mb-8">
        Nuova Pagina
      </h1>

      <PageForm />
    </div>
  )
}
