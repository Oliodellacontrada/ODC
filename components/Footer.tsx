'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, Heart } from 'lucide-react'

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
    <footer className="bg-gradient-to-br from-olive-100 via-sage-50 to-honey-50 border-t-2 border-olive-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Colonna Sinistra - Informazioni */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-olive-200">
            <h3 className="text-2xl font-bold text-olive-800 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informazioni
            </h3>
            <div className="flex flex-col gap-4">
              <Link
                href="/page/privacy"
                className="text-stone-700 hover:text-olive-600 transition-all hover:translate-x-1 flex items-center gap-2 font-medium"
              >
                <span className="w-2 h-2 bg-olive-400 rounded-full"></span>
                Privacy Policy
              </Link>
              <Link
                href="/page/cookie"
                className="text-stone-700 hover:text-olive-600 transition-all hover:translate-x-1 flex items-center gap-2 font-medium"
              >
                <span className="w-2 h-2 bg-olive-400 rounded-full"></span>
                Cookie Policy
              </Link>
              <Link
                href="/unsubscribe"
                className="text-stone-700 hover:text-olive-600 transition-all hover:translate-x-1 flex items-center gap-2 font-medium"
              >
                <span className="w-2 h-2 bg-olive-400 rounded-full"></span>
                Unsubscribe
              </Link>
              
              <div className="border-t border-olive-200 pt-4 mt-2">
                <a
                  href="mailto:alnet.dev@proton.me"
                  className="flex items-center gap-3 text-stone-700 hover:text-olive-600 transition-all hover:translate-x-1 group"
                >
                  <div className="p-2 bg-olive-200 rounded-lg group-hover:bg-olive-300 transition-colors">
                    <Mail className="w-5 h-5 text-olive-700" />
                  </div>
                  <span className="font-medium">alnet.dev@proton.me</span>
                </a>

                <a
                  href="https://ko-fi.com/alnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-stone-700 hover:text-olive-600 transition-all hover:translate-x-1 mt-4 group"
                >
                  <div className="p-2 bg-gradient-to-br from-honey-200 to-honey-300 rounded-lg group-hover:from-honey-300 group-hover:to-honey-400 transition-all">
                    <Heart className="w-5 h-5 text-honey-800 fill-honey-800" />
                  </div>
                  <span className="font-semibold">Sostieni il progetto</span>
                </a>
              </div>
            </div>
          </div>

          {/* Colonna Destra - Newsletter */}
          <div className="bg-gradient-to-br from-olive-600 to-olive-700 rounded-2xl p-8 shadow-xl text-white">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Newsletter
            </h3>
            <p className="text-olive-100 mb-6 leading-relaxed">
              Rimani aggiornato sulle novità dalla campagna, i nostri prodotti e le storie dell'olio extravergine
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
                required
                className="w-full px-4 py-3 border-2 border-olive-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey-400 bg-white/95 text-stone-900 placeholder-stone-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-honey-500 text-olive-900 font-bold rounded-lg hover:bg-honey-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
              >
                {loading ? 'Invio...' : '✓ Iscriviti ora'}
              </button>
            </form>
            {message && (
              <div className="mt-4 p-3 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="border-t-2 border-olive-300 mt-12 pt-8 text-center">
          <p className="text-stone-700 font-medium">
            © {new Date().getFullYear()} <span className="text-olive-800 font-bold">Olio della Contrada</span> · Tutti i diritti riservati
          </p>
        </div>
      </div>
    </footer>
  )
}
