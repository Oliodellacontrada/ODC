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
  type?: string
  youtube_url?: string | null
  author_name?: string | null
  show_date?: boolean
  published_at?: string | null
}

type Props = {
  post?: Post
  tags: Tag[]
  selectedTagIds?: string[]
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

function getYoutubeThumbnail(url: string): string | null {
  const id = getYoutubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null
}

function toDateInputValue(isoString: string | null | undefined): string {
  if (!isoString) return ''
  return isoString.slice(0, 10) // "YYYY-MM-DD"
}

export default function PostForm({ post, tags, selectedTagIds = [] }: Props) {
  const [type, setType] = useState(post?.type || 'articolo')
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [content, setContent] = useState(post?.content || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [coverImage, setCoverImage] = useState(post?.cover_image_url || '')
  const [youtubeUrl, setYoutubeUrl] = useState(post?.youtube_url || '')
  const [authorName, setAuthorName] = useState(post?.author_name || '')
  const [showDate, setShowDate] = useState(post?.show_date !== false)
  const [status, setStatus] = useState(post?.status || 'draft')
  const [publishedAt, setPublishedAt] = useState(toDateInputValue(post?.published_at))
  const [metaTitle, setMetaTitle] = useState(post?.meta_title || '')
  const [metaDesc, setMetaDesc] = useState(post?.meta_description || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(selectedTagIds)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!post) setSlug(generateSlug(value))
  }

  function handleYoutubeUrl(url: string) {
    setYoutubeUrl(url)
    const thumbnail = getYoutubeThumbnail(url)
    if (thumbnail) setCoverImage(thumbnail)
  }

  function toggleTag(tagId: string) {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  function resolvePublishedAt(): string | null {
    if (status !== 'published') return null
    // Se l'utente ha scelto una data, usa quella
    if (publishedAt) return new Date(publishedAt).toISOString()
    // Post esistente già pubblicato senza data modificata: mantieni l'originale
    if (post?.published_at) return post.published_at
    // Nuovo post pubblicato senza data scelta: usa adesso
    return new Date().toISOString()
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
        type,
        youtube_url: type === 'video' ? youtubeUrl : null,
        author_name: authorName || null,
        show_date: showDate,
        meta_title: metaTitle || title,
        meta_description: metaDesc || excerpt,
        author_id: user?.id,
        published_at: resolvePublishedAt(),
      }

      let postId = post?.id

      if (post?.id) {
        const { error } = await (supabase.from('posts') as any).update(postData).eq('id', post.id)
        if (error) throw error
      } else {
        const { data, error } = await (supabase.from('posts') as any).insert([postData]).select().single()
        if (error) throw error
        postId = data.id
      }

      await (supabase.from('posts_tags') as any).delete().eq('post_id', postId)
      if (selectedTags.length > 0) {
        await (supabase.from('posts_tags') as any).insert(selectedTags.map(tagId => ({ post_id: postId, tag_id: tagId })))
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
      <div className="bg-white rounded-lg shadow p-6 space-y-6">

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Tipo di contenuto</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setType('articolo')}
              className={`px-5 py-2 rounded-lg font-medium transition-all ${type === 'articolo' ? 'bg-olive-600 text-white shadow' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
              📝 Articolo
            </button>
            <button type="button" onClick={() => setType('video')}
              className={`px-5 py-2 rounded-lg font-medium transition-all ${type === 'video' ? 'bg-olive-600 text-white shadow' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
              🎬 Video
            </button>
          </div>
        </div>

        {/* Titolo */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Titolo *</label>
          <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} required
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500" />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Slug *</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500" />
        </div>

        {/* Autore */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            {type === 'video' ? 'Dal canale di...' : 'Autore'}
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder={type === 'video' ? 'Es. Olio della Contrada, Marco Rossi...' : 'Es. Andrea Longo'}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
          />
        </div>

        {/* Mostra data */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowDate(!showDate)}
            className={`relative w-11 h-6 rounded-full transition-colors ${showDate ? 'bg-olive-600' : 'bg-stone-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${showDate ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <label className="text-sm font-medium text-stone-700">Mostra data di pubblicazione</label>
        </div>

        {/* URL YouTube (solo video) */}
        {type === 'video' && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">URL YouTube *</label>
            <input type="url" value={youtubeUrl} onChange={(e) => handleYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500" />
            {getYoutubeId(youtubeUrl) && (
              <p className="text-xs text-green-600 mt-1 font-medium">✓ Thumbnail estratta automaticamente come copertina</p>
            )}
          </div>
        )}

        {/* Copertina */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Immagine di copertina {type === 'video' && <span className="text-stone-400">(estratta da YouTube)</span>}
          </label>
          {type === 'video' && coverImage ? (
            <div>
              <img src={coverImage} alt="Thumbnail" className="w-full max-w-sm rounded-xl shadow" />
              <button type="button" onClick={() => setCoverImage('')} className="mt-2 text-xs text-red-500 hover:text-red-700">Rimuovi</button>
            </div>
          ) : (
            <ImageUpload value={coverImage} onChange={setCoverImage} />
          )}
        </div>

        {/* Contenuto (solo articoli) */}
        {type === 'articolo' && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Contenuto *</label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        )}

        {/* Estratto / Descrizione */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            {type === 'video' ? 'Descrizione del video' : 'Estratto'}
          </label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500" />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-opacity ${selectedTags.includes(tag.id) ? 'opacity-100' : 'opacity-40'}`}
                style={{ backgroundColor: tag.color, color: 'white' }}>
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h3 className="text-lg font-semibold text-olive-800">SEO</h3>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Meta Title</label>
          <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Meta Description</label>
          <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={2}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500" />
        </div>
      </div>

      {/* Footer form */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500">
            <option value="draft">Bozza</option>
            <option value="published">Pubblicato</option>
          </select>

          {status === 'published' && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-stone-700 whitespace-nowrap">Data pubblicazione:</label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 text-sm"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors">
            Annulla
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-olive-600 text-white rounded-lg hover:bg-olive-700 transition-colors disabled:opacity-50">
            {loading ? 'Salvataggio...' : 'Salva'}
          </button>
        </div>
      </div>
    </form>
  )
}
