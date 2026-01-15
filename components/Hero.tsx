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
    <div className="relative h-[500px] bg-gradient-to-br from-olive-100 to-sage-100">
      {heroImage && (
        <Image
          src={heroImage}
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
      )}
      
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {title}
          </h1>
          {description && (
            <p className="text-xl md:text-2xl drop-shadow-lg max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
