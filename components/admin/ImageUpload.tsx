'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'

type Props = {
  value: string
  onChange: (url: string) => void
}

export default function ImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName)

      onChange(publicUrl)
    } catch (error) {
      alert('Errore durante l\'upload')
    } finally {
      setUploading(false)
    }
  }

  function handleRemove() {
    onChange('')
  }

  return (
    <div>
      {value ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-stone-300">
          <Image
            src={value}
            alt="Upload"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 text-stone-400 mb-3" />
            <p className="text-sm text-stone-600">
              {uploading ? 'Caricamento...' : 'Clicca per caricare'}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  )
}
