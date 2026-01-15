'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { usePathname } from 'next/navigation'

type SiteSettings = {
  logo_url: string | null
  site_title: string | null
}

export default function Navbar() {
  const [logo, setLogo] = useState<string | null>(null)
  const [title, setTitle] = useState('Olio della Contrada')
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('logo_url, site_title')
        .single()

      if (data) {
        const settings = data as SiteSettings
        setLogo(settings.logo_url)
        setTitle(settings.site_title || 'Olio della Contrada')
      }
    }
    loadSettings()
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/page/chi-siamo', label: 'Chi Siamo' },
    { href: '/', label: 'Blog' },
    { href: '/page/contatti', label: 'Contatti' },
  ]

  return (
    <nav className="bg-gradient-to-r from-white via-olive-50 to-sage-50 border-b-2 border-olive-300 sticky top-0 z-50 shadow-md backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo e Titolo */}
          <Link href="/" className="flex items-center gap-4 group">
            {logo && (
              <div className="relative">
                <div className="absolute inset-0 bg-olive-400 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Image
                  src={logo}
                  alt="Logo"
                  width={60}
                  height={60}
                  className="object-contain relative z-10 group-hover:scale-110 transition-transform"
                />
              </div>
            )}
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-olive-800 to-olive-600 bg-clip-text text-transparent group-hover:from-olive-600 group-hover:to-olive-800 transition-all">
                {title}
              </span>
              <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-olive-400 to-honey-400 transition-all duration-300 rounded-full"></div>
            </div>
          </Link>

          {/* Menu Links */}
          <div className="flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-2 font-semibold transition-all rounded-lg group ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-olive-600 to-olive-700 shadow-lg'
                      : 'text-stone-700 hover:text-olive-700'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-olive-100 to-sage-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                  {!isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-olive-400 to-honey-400 group-hover:w-3/4 transition-all duration-300"></div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
