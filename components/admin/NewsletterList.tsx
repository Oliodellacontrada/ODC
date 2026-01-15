'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Download, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

type Subscriber = {
  id: string
  email: string
  subscribed: boolean
  subscribed_at: string
  unsubscribed_at: string | null
}

export default function NewsletterList({ subscribers }: { subscribers: Subscriber[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  function exportCSV() {
    const activeSubscribers = subscribers.filter(s => s.subscribed)
    const csv = ['Email,Data Iscrizione']
    
    activeSubscribers.forEach(sub => {
      csv.push(`${sub.email},${new Date(sub.subscribed_at).toLocaleDateString('it-IT')}`)
    })

    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  async function handleDelete(id: string, email: string) {
    if (!confirm(`Eliminare ${email}?`)) return

    setDeleting(id)
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id)

      if (error) throw error
      router.refresh()
    } catch (error) {
      alert('Errore durante l\'eliminazione')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Esporta CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
                Stato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">
                Data Iscrizione
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-200">
            {subscribers.map((sub) => (
              <tr key={sub.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">
                  {sub.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    sub.subscribed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-stone-100 text-stone-800'
                  }`}>
                    {sub.subscribed ? 'Attivo' : 'Disiscritto'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                  {formatDate(sub.subscribed_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(sub.id, sub.email)}
                    disabled={deleting === sub.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
