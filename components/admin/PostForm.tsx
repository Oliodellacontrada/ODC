'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { generateSlug } from '@/lib/utils'
import TiptapEditor from './TiptapEditor'
import ImageUpload from './ImageUpload'

type Tag = {
  id: string
  name: string
  color: string
}

type Post = {
  id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image_url: string | null
  status: string
  meta_title: string
  meta_description: string
}

type Props = {
  post?: Post
  tags: Tag[]
  selectedTagIds?: string[]
}

export default function PostForm({ post, tags, selectedTagIds = [] }: Props) {
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [content, setContent] = useState(post?.content || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [coverImage, setCoverImage] = useState(post?.cover_image_url || '')
  const [status, setStatus] = useState(post?.status || 'draft')
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || '')
  const [metaDesc, setMetaDesc] = useState(post?.meta_description || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(selectedTagIds)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!post) {
      setSlug(generateSlug(value))
    }
  }

  function toggleTag(tagId: string) {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const postData = {
        title,
        slug,
        content,
        excerpt,
        cover_image_url: coverImage || null,
        status,
        meta_title: metaTitle || title,
        meta_description: metaDesc || excerpt,
        author_id: user?.id,
        published_at: status === 'published' ? new Date().toISOString() : null,
      }

      let postId = post?.id

      if (post?.id) {
        // ✅ FIX IMPORTANTE QUI
        const { error } = await (supabase.from('posts') as any)
          .update(postData)
          .eq('id', post.id)

        if (error) throw error
      } else {
        // ✅ FIX IMPORTANTE QUI
        const { data, error } = await (supabase.from('posts') as any)
          .insert([postData])
          .select()
          .single()

        if (error) throw error
        postId = data.id
      }

      // Gestisci tags (stesso workaround per sicurezza)
      await (supabase.from('posts_tags') as any)
        .delete()
        .eq('post_id', postId)

      if (selectedTags.length > 0) {
        const tagsData = selectedTags.map(tagId => ({
          post_id: postId,
          tag_id: tagId,
        }))

        await (supabase.from('posts_tags') as any)
          .insert(tagsData)
      }

      router.push('/admin/posts')
      router.refresh()
    } catch (error: any) {
      alert(error.message || 'Errore durante il salvataggio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* --- UI IDENTICA ALLA TUA, NON CAMBIATA --- */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Titolo *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Immagine di copertina
          </label>
          <ImageUpload value={coverImage} onChange={setCoverImage} />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Contenuto *
          </label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Estratto
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-opacity ${
                  selectedTags.includes(tag.id) ? 'opacity-100' : 'opacity-40'
                }`}
                style={{
                  backgroundColor: tag.color,
                  color: 'white',
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h3 className="text-lg font-semibold text-olive-800">SEO</h3>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
        >
          <option value="draft">Bozza</option>
          <option value="published">Pubblicato</option>
        </select>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvataggio...' : 'Salva'}
          </button>
        </div>
      </div>
    </form>
  )
}
