'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail } from 'lucide-react'

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
        <div className="grid grid-cols-3 gap-8">
          {/* Colonna Sinistra - Informazioni */}
          <div>
            <h3 className="text-lg font-semibold text-olive-800 mb-4">
              Informazioni
            </h3>
            <div className="flex flex-col gap-3">
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
                Unsubscribe
              </Link>
              
              <a
                href="mailto:alnet.dev@proton.me"
                className="flex items-center gap-2 text-stone-600 hover:text-olive-700 transition-colors mt-2"
              >
                <Mail className="w-5 h-5" />
                <span>alnet.dev@proton.me</span>
              </a>

              <a
                href="https://ko-fi.com/alnet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-stone-600 hover:text-olive-700 transition-colors mt-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
                </svg>
                <span>Sostieni il progetto</span>
              </a>
            </div>
          </div>

          {/* Colonna Centrale - Vuota */}
          <div></div>

          {/* Colonna Destra - Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-olive-800 mb-4">
              Newsletter
            </h3>
            <p className="text-stone-600 mb-4">
              Ricevi aggiornamenti sui nostri prodotti e novità dalla campagna
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
                required
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Invio...' : 'Iscriviti'}
              </button>
            </form>
            {message && (
              <p className="mt-2 text-sm text-stone-600">{message}</p>
            )}
          </div>
        </div>

        <div className="border-t border-olive-200 mt-8 pt-8 text-center text-stone-600 text-sm">
          © {new Date().getFullYear()} Olio della Contrada. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  )
}
