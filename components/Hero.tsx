'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type SiteSettings = {
  hero_image_url: string | null
  site_title: string | null
  site_description: string | null
}

export default function Hero() {
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [title, setTitle] = useState('Olio della Contrada')
  const [description, setDescription] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('hero_image_url, site_title, site_description')
        .single()

      if (data) {
        const settings = data as SiteSettings
        setHeroImage(settings.hero_image_url)
        setTitle(settings.site_title || 'Olio della Contrada')
        setDescription(settings.site_description || '')
      }
    }
    loadSettings()
  }, [])

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Sfondo con gradiente overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-olive-100 via-sage-50 to-honey-50">
        {heroImage && (
          <>
            <Image
              src={heroImage}
              alt="Hero"
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-olive-600/40 via-sage-600/30 to-transparent" />
          </>
        )}
      </div>

      {/* Elementi decorativi */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-olive-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-honey-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-sage-300/20 rounded-full blur-2xl"></div>

      {/* Contenuto */}
      <div className="relative h-full flex items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          {/* Badge superiore */}
          <div className="inline-block mb-6 px-6 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border-2 border-olive-300">
            <span className="text-olive-700 font-semibold text-sm tracking-wide">
              Olio Extravergine di Tradizione
            </span>
          </div>

          {/* Titolo principale */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-olive-800 via-olive-600 to-sage-700 bg-clip-text text-transparent drop-shadow-lg">
              {title}
            </span>
          </h1>

          {/* Descrizione */}
          {description && (
            <p className="text-2xl md:text-3xl text-stone-700 font-medium mb-8 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              {description}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#articoli"
              className="px-8 py-4 bg-gradient-to-r from-olive-600 to-olive-700 text-white font-bold rounded-xl hover:from-olive-700 hover:to-olive-800 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Scopri le Storie
            </a>
            <a
              href="/page/chi-siamo"
              className="px-8 py-4 bg-white/90 backdrop-blur-md text-olive-700 font-bold rounded-xl hover:bg-white transition-all transform hover:scale-105 shadow-lg border-2 border-olive-300"
            >
              Chi Siamo
            </a>
          </div>
        </div>
      </div>

      {/* Onda decorativa in basso */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="rgb(250, 250, 249)"
          />
        </svg>
      </div>
    </div>
  )
}
