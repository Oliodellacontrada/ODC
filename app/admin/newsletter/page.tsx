'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Send, Users, Mail, Trash2, Plus } from 'lucide-react'

type Subscriber = {
  id: string
  email: string
  subscribed: boolean
  subscribed_at: string
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [addingEmail, setAddingEmail] = useState(false)
  const [addMessage, setAddMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function load() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false })
    if (error) console.error('Errore:', error)
    setSubscribers((data || []) as Subscriber[])
  }

  useEffect(() => { load() }, [])

  const active = subscribers.filter((s) => s.subscribed === true)
  const cancelled = subscribers.filter((s) => s.subscribed === false)

  async function handleDelete(id: string) {
    if (!confirm('Rimuovere questo iscritto?')) return
    await supabase.from('newsletter_subscribers').delete().eq('id', id)
    load()
  }

  async function handleAddEmail() {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setAddMessage({ text: 'Inserisci un indirizzo email valido.', ok: false })
      return
    }
    setAddingEmail(true)
    setAddMessage(null)
    const { error } = await (supabase as any)
      .from('newsletter_subscribers')
      .insert({ email: newEmail.trim(), subscribed: true })
    setAddingEmail(false)
    if (error) {
      setAddMessage({ text: error.message.includes('duplicate') ? 'Email già presente.' : 'Errore durante il salvataggio.', ok: false })
    } else {
      setAddMessage({ text: 'Email aggiunta con successo!', ok: true })
      setNewEmail('')
      load()
    }
  }

  async function handleSend() {
    if (!subject.trim() || !content.trim()) return
    if (!confirm(`Stai per inviare la newsletter a ${active.length} iscritti. Confermi?`)) return
    setSending(true)
    setMessage(null)
    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ text: `Newsletter inviata con successo a ${data.sent} iscritti!`, ok: true })
        setSubject('')
        setContent('')
      } else {
        setMessage({ text: data.error || 'Errore durante invio', ok: false })
      }
    } catch {
      setMessage({ text: 'Errore durante invio', ok: false })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-olive-800 mb-8">Invia Newsletter</h1>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-olive-100">
          <div className="p-3 bg-olive-100 rounded-xl">
            <Users className="w-6 h-6 text-olive-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-olive-800">{subscribers.length}</p>
            <p className="text-stone-500 text-sm">Iscritti totali</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-olive-100">
          <div className="p-3 bg-green-100 rounded-xl">
            <Mail className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-700">{active.length}</p>
            <p className="text-stone-500 text-sm">Attivi</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-olive-100">
          <div className="p-3 bg-amber-100 rounded-xl">
            <Send className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-700">{cancelled.length}</p>
            <p className="text-stone-500 text-sm">Cancellati</p>
          </div>
        </div>
      </div>

      {/* Lista iscritti */}
      <div className="bg-white rounded-2xl shadow-lg border border-olive-100 p-8 mb-10">
        <h2 className="text-xl font-bold text-olive-800 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Lista iscritti
        </h2>

        {/* Aggiungi email manualmente */}
        <div className="flex gap-3 mb-6">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
            placeholder="Aggiungi email manualmente..."
            className="flex-1 border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive-400"
          />
          <button
            onClick={handleAddEmail}
            disabled={addingEmail}
            className="flex items-center gap-2 px-4 py-2.5 bg-olive-600 text-white text-sm font-semibold rounded-xl hover:bg-olive-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Aggiungi
          </button>
        </div>
        {addMessage && (
          <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${addMessage.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {addMessage.text}
          </div>
        )}

        {subscribers.length === 0 ? (
          <p className="text-stone-400 italic">Nessun iscritto.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {subscribers.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${s.subscribed ? 'bg-green-500' : 'bg-stone-300'}`} />
                  <span className="text-stone-700 font-medium text-sm truncate">{s.email}</span>
                  {!s.subscribed && <span className="text-xs text-stone-400 bg-stone-200 px-2 py-0.5 rounded-full shrink-0">cancellato</span>}
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form invio */}
      <div className="bg-white rounded-2xl shadow-lg border border-olive-100 p-8">
        <h2 className="text-xl font-bold text-olive-800 mb-6 flex items-center gap-2">
          <Send className="w-5 h-5" />
          Scrivi la newsletter
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Oggetto</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Es. Novita dalla campagna - Marzo 2026"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Contenuto</label>
            <p className="text-xs text-stone-400 mb-2">Puoi usare HTML per formattare il testo (es. &lt;b&gt;grassetto&lt;/b&gt;, &lt;br&gt; per andare a capo)</p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="Scrivi qui il contenuto della newsletter..."
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive-400 resize-none"
            />
          </div>
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${message.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}
          <button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !content.trim() || active.length === 0}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-olive-600 to-olive-700 text-white font-bold rounded-xl hover:from-olive-700 hover:to-olive-800 transition-all disabled:opacity-50 shadow-lg"
          >
            <Send className="w-5 h-5" />
            {sending ? 'Invio in corso...' : `Invia a ${active.length} iscritti`}
          </button>
        </div>
      </div>
    </div>
  )
}
