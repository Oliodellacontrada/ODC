'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Send, Users, Mail, Trash2, Plus, Download, Upload } from 'lucide-react'

type Subscriber = {
  id: string
  email: string
  subscribed: boolean
  subscribed_at: string
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [addingEmail, setAddingEmail] = useState(false)
  const [addMessage, setAddMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [importMessage, setImportMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  async function load() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/admin/login'); return }
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false })
    if (error) console.error('Errore:', error)
    const subs = (data || []) as Subscriber[]
    setSubscribers(subs)
    // Seleziona di default solo gli attivi
    setSelected(new Set(subs.filter(s => s.subscribed).map(s => s.id)))
  }

  useEffect(() => { load() }, [])

  const active = subscribers.filter((s) => s.subscribed === true)
  const cancelled = subscribers.filter((s) => s.subscribed === false)
  const activeSelected = subscribers.filter(s => s.subscribed && selected.has(s.id))

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectAll() {
    setSelected(new Set(subscribers.filter(s => s.subscribed).map(s => s.id)))
  }

  function deselectAll() {
    setSelected(new Set())
  }

  async function handleDelete(id: string) {
    if (!confirm('Rimuovere questo iscritto?')) return
    await supabase.from('newsletter_subscribers').delete().eq('id', id)
    load()
  }

  async function handleToggle(s: Subscriber) {
    await (supabase as any)
      .from('newsletter_subscribers')
      .update({ subscribed: !s.subscribed })
      .eq('id', s.id)
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

  function handleExport() {
    const rows = ['email,stato']
    subscribers.forEach(s => {
      rows.push(`${s.email},${s.subscribed ? 'attivo' : 'cancellato'}`)
    })
    const csv = rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-iscritti-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportMessage(null)
    const text = await file.text()
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const emailLines = lines.filter(l => l.includes('@'))
    if (emailLines.length === 0) {
      setImportMessage({ text: 'Nessuna email trovata nel file.', ok: false })
      return
    }
    const emails = emailLines.map(l => l.split(',')[0].trim().toLowerCase())
    const existingEmails = subscribers.map(s => s.email.toLowerCase())
    const newEmails = emails.filter(e => !existingEmails.includes(e))
    if (newEmails.length === 0) {
      setImportMessage({ text: 'Tutte le email sono già presenti.', ok: false })
      return
    }
    const { error } = await (supabase as any)
      .from('newsletter_subscribers')
      .insert(newEmails.map(email => ({ email, subscribed: true })))
    if (error) {
      setImportMessage({ text: 'Errore durante l\'importazione.', ok: false })
    } else {
      setImportMessage({ text: `${newEmails.length} email importate con successo!`, ok: true })
      load()
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSend() {
    if (!subject.trim() || !content.trim()) return
    const emailsToSend = subscribers
      .filter(s => s.subscribed && selected.has(s.id))
      .map(s => s.email)
    if (emailsToSend.length === 0) return
    if (!confirm(`Stai per inviare la newsletter a ${emailsToSend.length} iscritti selezionati. Confermi?`)) return
    setSending(true)
    setMessage(null)
    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content, emails: emailsToSend }),
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
          <div className="p-3 bg-olive-100 rounded-xl"><Users className="w-6 h-6 text-olive-700" /></div>
          <div>
            <p className="text-2xl font-bold text-olive-800">{subscribers.length}</p>
            <p className="text-stone-500 text-sm">Iscritti totali</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-olive-100">
          <div className="p-3 bg-green-100 rounded-xl"><Mail className="w-6 h-6 text-green-700" /></div>
          <div>
            <p className="text-2xl font-bold text-green-700">{active.length}</p>
            <p className="text-stone-500 text-sm">Attivi</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-olive-100">
          <div className="p-3 bg-amber-100 rounded-xl"><Send className="w-6 h-6 text-amber-700" /></div>
          <div>
            <p className="text-2xl font-bold text-amber-700">{cancelled.length}</p>
            <p className="text-stone-500 text-sm">Cancellati</p>
          </div>
        </div>
      </div>

      {/* Lista iscritti */}
      <div className="bg-white rounded-2xl shadow-lg border border-olive-100 p-8 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-olive-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Lista iscritti
          </h2>
          <div className="flex gap-2">
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-olive-700 bg-olive-50 hover:bg-olive-100 border border-olive-200 rounded-xl transition-colors">
              <Download className="w-4 h-4" /> Esporta CSV
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-olive-700 bg-olive-50 hover:bg-olive-100 border border-olive-200 rounded-xl transition-colors">
              <Upload className="w-4 h-4" /> Importa CSV
            </button>
            <input ref={fileInputRef} type="file" accept=".csv,.txt" onChange={handleImport} className="hidden" />
          </div>
        </div>

        {importMessage && (
          <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${importMessage.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {importMessage.text}
          </div>
        )}

        {/* Aggiungi email */}
        <div className="flex gap-3 mb-6">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
            placeholder="Aggiungi email manualmente..."
            className="flex-1 border border-stone-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive-400"
          />
          <button onClick={handleAddEmail} disabled={addingEmail}
            className="flex items-center gap-2 px-4 py-2.5 bg-olive-600 text-white text-sm font-semibold rounded-xl hover:bg-olive-700 transition-colors disabled:opacity-50">
            <Plus className="w-4 h-4" /> Aggiungi
          </button>
        </div>
        {addMessage && (
          <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${addMessage.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {addMessage.text}
          </div>
        )}

        {/* Controlli selezione */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-stone-400">
            Pallino = attivo/cancellato &nbsp;·&nbsp; Checkbox = includi nell&apos;invio
          </p>
          <div className="flex gap-3 text-xs">
            <button onClick={selectAll} className="text-olive-600 hover:text-olive-800 font-medium">Seleziona tutti</button>
            <span className="text-stone-300">|</span>
            <button onClick={deselectAll} className="text-stone-500 hover:text-stone-700 font-medium">Deseleziona tutti</button>
          </div>
        </div>

        {subscribers.length === 0 ? (
          <p className="text-stone-400 italic">Nessun iscritto.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {subscribers.map((s) => (
              <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${selected.has(s.id) ? 'bg-olive-50 border-olive-200' : 'bg-stone-50 border-stone-100'}`}>
                <div className="flex items-center gap-3 min-w-0">
                  {/* Checkbox selezione invio */}
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => toggleSelect(s.id)}
                    disabled={!s.subscribed}
                    className="w-4 h-4 accent-olive-600 shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                  />
                  {/* Pallino stato */}
                  <button
                    onClick={() => handleToggle(s)}
                    title={s.subscribed ? 'Clicca per disattivare' : 'Clicca per attivare'}
                    className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors hover:opacity-70 ${s.subscribed ? 'bg-green-500' : 'bg-stone-300'}`}
                  />
                  <span className="text-stone-700 font-medium text-sm truncate">{s.email}</span>
                  {!s.subscribed && (
                    <span className="text-xs text-stone-400 bg-stone-200 px-2 py-0.5 rounded-full shrink-0">cancellato</span>
                  )}
                </div>
                <button onClick={() => handleDelete(s.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 ml-2">
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
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="Es. Novita dalla campagna - Marzo 2026"
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Contenuto</label>
            <p className="text-xs text-stone-400 mb-2">Puoi usare HTML per formattare il testo (es. &lt;b&gt;grassetto&lt;/b&gt;, &lt;br&gt; per andare a capo)</p>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10}
              placeholder="Scrivi qui il contenuto della newsletter..."
              className="w-full border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-olive-400 resize-none" />
          </div>
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${message.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}
          <button onClick={handleSend}
            disabled={sending || !subject.trim() || !content.trim() || activeSelected.length === 0}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-olive-600 to-olive-700 text-white font-bold rounded-xl hover:from-olive-700 hover:to-olive-800 transition-all disabled:opacity-50 shadow-lg">
            <Send className="w-5 h-5" />
            {sending ? 'Invio in corso...' : `Invia a ${activeSelected.length} iscritti selezionati`}
          </button>
        </div>
      </div>
    </div>
  )
}
