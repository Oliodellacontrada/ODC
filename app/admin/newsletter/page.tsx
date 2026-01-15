import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import NewsletterList from '@/components/admin/NewsletterList'

export default async function AdminNewsletterPage() {
  const supabase = createServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/admin/login')
  }

  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false })

  const activeSubscribers = subscribers?.filter(s => s.subscribed) || []
  const unsubscribed = subscribers?.filter(s => !s.subscribed) || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-olive-800 mb-8">
        Newsletter
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-stone-600 mb-2">Iscritti Attivi</p>
          <p className="text-3xl font-bold text-olive-700">
            {activeSubscribers.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-stone-600 mb-2">Disiscritti</p>
          <p className="text-3xl font-bold text-stone-500">
            {unsubscribed.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-stone-600 mb-2">Totale</p>
          <p className="text-3xl font-bold text-stone-700">
            {subscribers?.length || 0}
          </p>
        </div>
      </div>

      <NewsletterList subscribers={subscribers || []} />
    </div>
  )
}
