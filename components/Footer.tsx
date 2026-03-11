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
        setMessage(data.error || 'Errore iscrizione')
      }
    } catch {
      setMessage('Errore iscrizione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-gradient-to-br from-olive-100 via-sage-50 to-honey-50 border-t-2 border-olive-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-olive-200">
            <h3 className="text-2xl font-bold text-olive-800 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informazioni
            </h3>
            <div cl
