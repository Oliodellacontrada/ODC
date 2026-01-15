import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-olive-800 mb-8">
        Impostazioni Sito
      </h1>

      <SettingsForm settings={settings} />
    </div>
  )
}
