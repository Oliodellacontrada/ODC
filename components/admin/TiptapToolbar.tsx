'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import TiptapToolbar from './TiptapToolbar'

type Props = {
  content: string
  onChange: (content: string) => void
}

export default function TiptapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg',
        },
        allowBase64: true,
      }).extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: null,
              parseHTML: element => element.getAttribute('width'),
              renderHTML: attributes => {
                if (!attributes.width) return {}
                return { width: attributes.width }
              },
            },
          }
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-olive-600 underline',
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      Placeholder.configure({
        placeholder: 'Inizia a scrivere il tuo articolo...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border border-stone-300 rounded-lg overflow-hidden">
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
