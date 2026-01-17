'use client'

import { Editor } from '@tiptap/react'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube,
  Undo,
  Redo
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

type Props = {
  editor: Editor
}

export default function TiptapToolbar({ editor }: Props) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  async function addImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
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

        editor.chain().focus().setImage({ src: publicUrl }).run()
      } catch (error) {
        alert('Errore durante l\'upload dell\'immagine')
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }

  function addLink() {
    const url = window.prompt('URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  function addYoutube() {
    const url = window.prompt('URL YouTube:')
    if (url) {
      editor.commands.setYoutubeVideo({ src: url })
    }
  }

  function setImageSize(size: 'small' | 'medium' | 'large' | 'full') {
    const sizes = {
      small: '300px',
      medium: '500px',
      large: '700px',
      full: '100%'
    }
    
    // Trova tutte le immagini nell'editor
    const { state } = editor
    const { from, to } = state.selection
    
    // Cerca un'immagine nella selezione corrente o vicino al cursore
    let imagePos = -1
    state.doc.nodesBetween(from - 1, to + 1, (node, pos) => {
      if (node.type.name === 'image' && imagePos === -1) {
        imagePos = pos
        return false
      }
    })
    
    if (imagePos !== -1) {
      editor.commands.setNodeSelection(imagePos)
      editor.commands.updateAttributes('image', { 
        width: sizes[size]
      })
    } else {
      alert('Posiziona il cursore vicino a un\'immagine prima di ridimensionarla')
    }
  }

  const Button = ({ 
    onClick, 
    active, 
    disabled, 
    children 
  }: { 
    onClick: () => void
    active?: boolean
    disabled?: boolean
    children: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded hover:bg-stone-100 transition-colors ${
        active ? 'bg-olive-100 text-olive-700' : 'text-stone-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-stone-300 bg-stone-50">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      >
        <Bold className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
      >
        <Italic className="w-5 h-5" />
      </Button>

      <div className="w-px h-8 bg-stone-300 mx-1" />

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
      >
        <Heading3 className="w-5 h-5" />
      </Button>

      <div className="w-px h-8 bg-stone-300 mx-1" />

      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
      >
        <List className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
      >
        <ListOrdered className="w-5 h-5" />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
      >
        <Quote className="w-5 h-5" />
      </Button>

      <div className="w-px h-8 bg-stone-300 mx-1" />

      <Button onClick={addLink} active={editor.isActive('link')}>
        <LinkIcon className="w-5 h-5" />
      </Button>

      <Button onClick={addImage} disabled={uploading}>
        <ImageIcon className="w-5 h-5" />
      </Button>

      <Button onClick={addYoutube}>
        <Youtube className="w-5 h-5" />
      </Button>

      <div className="w-px h-8 bg-stone-300 mx-1" />

      {/* Ridimensiona immagine - sempre visibile */}
      <span className="text-xs text-stone-500 px-2">Immagine:</span>
      <Button onClick={() => setImageSize('small')}>
        <span className="text-xs font-bold">S</span>
      </Button>
      <Button onClick={() => setImageSize('medium')}>
        <span className="text-xs font-bold">M</span>
      </Button>
      <Button onClick={() => setImageSize('large')}>
        <span className="text-xs font-bold">L</span>
      </Button>
      <Button onClick={() => setImageSize('full')}>
        <span className="text-xs font-bold">XL</span>
      </Button>

      <div className="w-px h-8 bg-stone-300 mx-1" />

      <div className="w-px h-8 bg-stone-300 mx-1" />

      <Button onClick={() => editor.chain().focus().undo().run()}>
        <Undo className="w-5 h-5" />
      </Button>

      <Button onClick={() => editor.chain().focus().redo().run()}>
        <Redo className="w-5 h-5" />
      </Button>
    </div>
  )
}
