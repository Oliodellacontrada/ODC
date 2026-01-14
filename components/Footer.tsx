'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Grazie per esserti iscritto!')
        setEmail('')
      } else {
        setMessage(data.error || 'Errore durante l\'iscrizione')
      }
    } catch (error) {
      setMessage('Errore durante l\'iscrizione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-olive-50 border-t border-olive-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-olive-800 mb-4">
              Iscriviti alla Newsletter
            </h3>
            <p className="text-stone-600 mb-4">
              Ricevi aggiornamenti sui nostri prodotti e novità dalla campagna
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
                required
                className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Invio...' : 'Iscriviti'}
              </button>
            </form>
            {message && (
              <p className="mt-2 text-sm text-stone-600">{message}</p>
            )}
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-olive-800 mb-4">
              Informazioni
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/page/privacy"
                className="text-stone-600 hover:text-olive-700 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/page/cookie"
                className="text-stone-600 hover:text-olive-700 transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                href="/unsubscribe"
                className="text-stone-600 hover:text-olive-700 transition-colors"
              >
                Disiscrivi Newsletter
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-olive-200 mt-8 pt-8 text-center text-stone-600 text-sm">
          © {new Date().getFullYear()} Olio della Contrada. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  )
}
