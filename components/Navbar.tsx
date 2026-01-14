'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function Navbar() {
  const [logo, setLogo] = useState<string | null>(null)
  const [title, setTitle] = useState('Olio della Contrada')
  const supabase = createClient()

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('logo_url, site_title')
        .single()

      if (data) {
        setLogo(data.logo_url)
        setTitle(data.site_title || 'Olio della Contrada')
      }
    }
    loadSettings()
  }, [])

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            {logo && (
              <Image
                src={logo}
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            )}
            <span className="text-xl font-semibold text-olive-800">
              {title}
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-stone-700 hover:text-olive-700 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="text-stone-700 hover:text-olive-700 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
