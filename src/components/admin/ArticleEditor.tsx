'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'
import { slugify, calculateReadingTime } from '@/lib/utils'
import type { ArticleWithRelations, Category, Tag, ArticleStatus } from '@/types'
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, ImageIcon, LinkIcon, AlignLeft, AlignCenter,
  AlignRight, Save, Eye, Send, Clock, X, Plus, Upload, Loader2,
  ToggleLeft, ToggleRight, ChevronDown, ChevronUp
} from 'lucide-react'

interface Props {
  article: ArticleWithRelations | null
  categories: Category[]
  tags: Tag[]
  mode: 'create' | 'edit'
}

export function ArticleEditor({ article, categories, tags, mode }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [seoOpen, setSeoOpen] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [form, setForm] = useState({
    title: article?.title || '',
    subtitle: article?.subtitle || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    category_id: article?.category_id || '',
    status: (article?.status || 'draft') as ArticleStatus,
    featured_image_url: article?.featured_image_url || '',
    featured_image_alt: article?.featured_image_alt || '',
    seo_title: article?.seo_title || '',
    seo_description: article?.seo_description || '',
    meta_keywords: article?.meta_keywords || '',
    is_featured: article?.is_featured || false,
    is_breaking: article?.is_breaking || false,
    scheduled_at: article?.scheduled_at || '',
  })
  const [selectedTags, setSelectedTags] = useState<string[]>(
    article?.tags?.map((t) => t.id) || []
  )

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Start writing your story…' }),
    ],
    content: article?.content || '',
    editorProps: {
      attributes: { class: 'focus:outline-none min-h-[500px] font-serif text-ink-900 dark:text-ink-100' },
    },
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === 'create' && form.title && !article?.slug) {
      setForm((f) => ({ ...f, slug: slugify(form.title) }))
    }
  }, [form.title, mode, article?.slug])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('article-images')
        .upload(filename, file, { cacheControl: '3600', upsert: false })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage.from('article-images').getPublicUrl(filename)
      setForm((f) => ({ ...f, featured_image_url: publicUrl }))
      toast.success('Image uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const insertImageInEditor = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    try {
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-inline.${ext}`
      await supabase.storage.from('article-images').upload(filename, file)
      const { data: { publicUrl } } = supabase.storage.from('article-images').getPublicUrl(filename)
      editor.chain().focus().setImage({ src: publicUrl }).run()
    } catch {
      toast.error('Image insert failed')
    }
  }

  const setLink = () => {
    const url = window.prompt('Enter URL:')
    if (!url || !editor) return
    editor.chain().focus().setLink({ href: url }).run()
  }

  async function saveArticle(status?: ArticleStatus) {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (!form.slug.trim()) { toast.error('Slug is required'); return }
    if (!editor) return

    setSaving(true)
    const content = editor.getHTML()
    const readingTime = calculateReadingTime(content)
    const finalStatus = status || form.status

   const articleData = {
  title: form.title,
  subtitle: form.subtitle || null,
  slug: form.slug,
  excerpt: form.excerpt || null,
  featured_image_url: form.featured_image_url || null,
  featured_image_alt: form.featured_image_alt || null,
  seo_title: form.seo_title || null,
  seo_description: form.seo_description || null,
  meta_keywords: form.meta_keywords || null,
  is_featured: form.is_featured,
  is_breaking: form.is_breaking,
  scheduled_at: form.scheduled_at || null,
  category_id: form.category_id || null,
  content,
  reading_time: readingTime,
  status: finalStatus,
  published_at: finalStatus === 'published' && !article?.published_at
    ? new Date().toISOString()
    : article?.published_at || null,
}

    try {
      let articleId = article?.id

      if (mode === 'create') {
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from('articles')
          .insert({ ...articleData, author_id: user!.id })
          .select('id')
          .single()
        if (error) throw error
        articleId = data.id
      } else {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', articleId!)
        if (error) throw error
      }

      // Sync tags
      if (articleId) {
        await supabase.from('article_tags').delete().eq('article_id', articleId)
        if (selectedTags.length > 0) {
          await supabase.from('article_tags').insert(
            selectedTags.map((tag_id) => ({ article_id: articleId!, tag_id }))
          )
        }
      }

      toast.success(finalStatus === 'published' ? 'Article published!' : 'Saved!')
      if (mode === 'create') router.push(`/admin/articles/${articleId}/edit`)
      else router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const toolbarBtn = (active: boolean, action: () => void, title: string, Icon: any) => (
    <button
      type="button"
      onClick={action}
      title={title}
      className={`p-1.5 rounded transition-colors ${active ? 'bg-accent text-white' : 'text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-100'}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100">
          {mode === 'create' ? 'New Article' : 'Edit Article'}
        </h1>
        <div className="flex items-center gap-2">
          {form.status === 'published' && article?.slug && (
            <a href={`/article/${article.slug}`} target="_blank" className="btn-ghost text-sm py-2">
              <Eye className="w-4 h-4" /> Preview
            </a>
          )}
          <button onClick={() => saveArticle('draft')} disabled={saving} className="btn-secondary text-sm py-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button onClick={() => saveArticle('published')} disabled={saving} className="btn-primary text-sm py-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {form.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-5">
            <input
              type="text"
              placeholder="Article Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full text-3xl font-serif font-bold bg-transparent border-none outline-none text-ink-900 dark:text-ink-100 placeholder-ink-300 dark:placeholder-ink-700"
            />
            <input
              type="text"
              placeholder="Subtitle or deck (optional)"
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              className="w-full mt-2 text-lg font-serif bg-transparent border-none outline-none text-ink-600 dark:text-ink-400 placeholder-ink-300 dark:placeholder-ink-700 italic"
            />
            <div className="mt-3 pt-3 border-t border-ink-100 dark:border-ink-800 flex items-center gap-2">
              <label className="text-xs text-ink-500 shrink-0">Slug:</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                className="flex-1 text-xs font-mono text-ink-600 dark:text-ink-400 bg-transparent border-none outline-none"
              />
            </div>
          </div>

          {/* Rich text editor */}
          <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 overflow-hidden">
            {/* Toolbar */}
            {editor && (
              <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-950">
                {toolbarBtn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'Bold', Bold)}
                {toolbarBtn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'Italic', Italic)}
                {toolbarBtn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), 'Underline', UnderlineIcon)}
                {toolbarBtn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), 'Strike', Strikethrough)}
                <div className="w-px h-5 bg-ink-200 dark:bg-ink-700 mx-1" />
                {toolbarBtn(editor.isActive('heading', { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), 'H1', Heading1)}
                {toolbarBtn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', Heading2)}
                {toolbarBtn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3', Heading3)}
                <div className="w-px h-5 bg-ink-200 dark:bg-ink-700 mx-1" />
                {toolbarBtn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), 'Bullet List', List)}
                {toolbarBtn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), 'Ordered List', ListOrdered)}
                {toolbarBtn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), 'Blockquote', Quote)}
                {toolbarBtn(editor.isActive('code'), () => editor.chain().focus().toggleCode().run(), 'Code', Code)}
                <div className="w-px h-5 bg-ink-200 dark:bg-ink-700 mx-1" />
                {toolbarBtn(editor.isActive({ textAlign: 'left' }), () => editor.chain().focus().setTextAlign('left').run(), 'Align Left', AlignLeft)}
                {toolbarBtn(editor.isActive({ textAlign: 'center' }), () => editor.chain().focus().setTextAlign('center').run(), 'Align Center', AlignCenter)}
                {toolbarBtn(editor.isActive({ textAlign: 'right' }), () => editor.chain().focus().setTextAlign('right').run(), 'Align Right', AlignRight)}
                <div className="w-px h-5 bg-ink-200 dark:bg-ink-700 mx-1" />
                <button
                  type="button"
                  onClick={setLink}
                  title="Add Link"
                  className="p-1.5 rounded text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <label className="p-1.5 rounded text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 cursor-pointer" title="Insert Image">
                  <ImageIcon className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={insertImageInEditor} />
                </label>
              </div>
            )}
            <div className="p-5">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-5">
            <label className="block text-sm font-semibold text-ink-700 dark:text-ink-300 mb-2">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              rows={3}
              placeholder="A brief summary for previews and SEO…"
              className="form-input resize-none text-sm"
            />
          </div>

          {/* SEO panel */}
          <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 overflow-hidden">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="font-semibold text-ink-700 dark:text-ink-300 text-sm">SEO Settings</span>
              {seoOpen ? <ChevronUp className="w-4 h-4 text-ink-400" /> : <ChevronDown className="w-4 h-4 text-ink-400" />}
            </button>
            {seoOpen && (
              <div className="p-5 pt-0 border-t border-ink-100 dark:border-ink-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-600 dark:text-ink-400 mb-1.5">SEO Title</label>
                  <input
                    type="text"
                    value={form.seo_title}
                    onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))}
                    className="form-input text-sm"
                    placeholder={form.title}
                    maxLength={70}
                  />
                  <p className="text-xs text-ink-400 mt-1">{(form.seo_title || form.title).length}/70 characters</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-600 dark:text-ink-400 mb-1.5">Meta Description</label>
                  <textarea
                    value={form.seo_description}
                    onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))}
                    rows={2}
                    className="form-input resize-none text-sm"
                    placeholder={form.excerpt || 'Describe this article for search engines…'}
                    maxLength={160}
                  />
                  <p className="text-xs text-ink-400 mt-1">{form.seo_description.length}/160 characters</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-600 dark:text-ink-400 mb-1.5">Meta Keywords</label>
                  <input
                    type="text"
                    value={form.meta_keywords}
                    onChange={(e) => setForm((f) => ({ ...f, meta_keywords: e.target.value }))}
                    className="form-input text-sm"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Publish settings */}
          <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-5">
            <h3 className="font-semibold text-ink-800 dark:text-ink-200 text-sm mb-4">Publish Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-ink-600 dark:text-ink-400 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ArticleStatus }))}
                  className="form-input text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              {form.status === 'scheduled' && (
                <div>
                  <label className="block text-xs font-semibold text-ink-600 dark:text-ink-400 mb-1.5">Schedule Date</label>
                  <input
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value }))}
                    className="form-input text-sm"
                  />
                </div>
              )}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-ink-700 dark:text-ink-300">Featured Article</span>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_featured: !f.is_featured }))}
                  className={`transition-colors ${form.is_featured ? 'text-accent' : 'text-ink-300 dark:text-ink-700'}`}
                >
                  {form.is_featured ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-ink-700 dark:text-ink-300">Breaking News</span>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_breaking: !f.is_breaking }))}
                  className={`transition-colors ${form.is_breaking ? 'text-accent' : 'text-ink-300 dark:text-ink-700'}`}
                >
                  {form.is_breaking ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Featured image */}
          <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-5">
            <h3 className="font-semibold text-ink-800 dark:text-ink-200 text-sm mb-4">Featured Image</h3>
            {form.featured_image_url ? (
              <div className="relative">
                <img src={form.featured_image_url} alt="Featured" className="w-full aspect-video object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, featured_image_url: '' }))}
                  className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-ink-300 dark:border-ink-700 rounded-xl p-6 cursor-pointer hover:border-accent transition-colors">
                {uploadingImage ? (
                  <Loader2 className="w-8 h-8 text-accent animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-ink-400 mb-2" />
                    <span className="text-xs text-ink-500">Upload image</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            )}
            <div className="mt-3">
              <input
                type="text"
                value={form.featured_image_url}
                onChange={(e) => setForm((f) => ({ ...f, featured_image_url: e.target.value }))}
                placeholder="Or paste image URL"
                className="form-input text-xs"
              />
              <input
                type="text"
                value={form.featured_image_alt}
                onChange={(e) => setForm((f) => ({ ...f, featured_image_alt: e.target.value }))}
                placeholder="Alt text (accessibility)"
                className="form-input text-xs mt-2"
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-5">
            <h3 className="font-semibold text-ink-800 dark:text-ink-200 text-sm mb-3">Category</h3>
            <select
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              className="form-input text-sm"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-5">
            <h3 className="font-semibold text-ink-800 dark:text-ink-200 text-sm mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const selected = selectedTags.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedTags((prev) =>
                      selected ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
                    )}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      selected
                        ? 'bg-accent text-white'
                        : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:bg-ink-200 dark:hover:bg-ink-700'
                    }`}
                  >
                    {selected && '✓ '}{tag.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
