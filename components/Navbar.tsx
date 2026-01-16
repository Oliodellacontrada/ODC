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

          {/* Menu Links + WhatsApp */}
          <div className="flex items-center gap-4">
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

            {/* Pulsante WhatsApp */}
            <a
              href="https://wa.me/393474160611"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
              title="Contattaci su WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="hidden md:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
