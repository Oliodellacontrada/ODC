'use client'
import { useState } from 'react'

export default function UnsubscribeClient() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleUnsubscribe(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('Ti sei cancellato con successo dalla newsletter.')
        setEmail('')
      } else {
        setMessage(data.error || 'Errore durante la cancellazione')
      }
    } catch (error) {
      setMessage('Errore durante la cancellazione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-olive-800 mb-4">
          Cancellati dalla Newsletter
        </h1>
        <p className="text-stone-600 mb-6">
          Inserisci la tua email per cancellarti dalla newsletter.
        </p>
        <form onSubmit={handleUnsubscribe} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
              placeholder="tua@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Elaborazione...' : 'Cancellati'}
          </button>
        </form>
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.includes('successo')
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
