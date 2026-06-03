'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Tag } from '@/types'

export default function TagsAdminPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [newTag, setNewTag] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  async function load() {
    const { data } = await supabase.from('tags').select('*').order('name')
    setTags(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function addTag(e: React.FormEvent) {
    e.preventDefault()
    if (!newTag.trim()) return
    setSaving(true)
    const { error } = await supabase.from('tags').insert({ name: newTag.trim(), slug: slugify(newTag.trim()) })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Tag added')
      setNewTag('')
      load()
    }
    setSaving(false)
  }

  async function deleteTag(id: string) {
    if (!confirm('Delete this tag?')) return
    const { error } = await supabase.from('tags').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Tag deleted')
    load()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100">Tags</h1>
        <p className="text-ink-500 text-sm mt-0.5">{tags.length} tags</p>
      </div>

      {/* Add tag */}
      <form onSubmit={addTag} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add a new tag…"
          className="form-input flex-1"
        />
        <button type="submit" disabled={saving || !newTag.trim()} className="btn-primary shrink-0">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Tag
        </button>
      </form>

      {/* Tags display */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-ink-400" /></div>
      ) : tags.length === 0 ? (
        <div className="text-center py-16 text-ink-500 bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800">
          <p className="font-serif text-xl">No tags yet</p>
          <p className="text-sm mt-1">Add your first tag above.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-5">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-ink-100 dark:bg-ink-800 rounded-full group"
              >
                <span className="text-sm font-medium text-ink-700 dark:text-ink-300">#{tag.name}</span>
                <button
                  onClick={() => deleteTag(tag.id)}
                  className="w-4 h-4 flex items-center justify-center text-ink-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Table view */}
          <details className="mt-6">
            <summary className="text-xs font-semibold text-ink-500 cursor-pointer hover:text-ink-700">View as table</summary>
            <table className="w-full text-sm mt-4">
              <thead>
                <tr className="border-b border-ink-100 dark:border-ink-800 text-left">
                  <th className="pb-2 text-xs font-semibold text-ink-400 uppercase tracking-wider">Name</th>
                  <th className="pb-2 text-xs font-semibold text-ink-400 uppercase tracking-wider">Slug</th>
                  <th className="pb-2 text-xs font-semibold text-ink-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50 dark:divide-ink-800">
                {tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-ink-50 dark:hover:bg-ink-800/30">
                    <td className="py-2.5 font-medium text-ink-800 dark:text-ink-200">#{tag.name}</td>
                    <td className="py-2.5 text-ink-500 font-mono text-xs">{tag.slug}</td>
                    <td className="py-2.5">
                      <button onClick={() => deleteTag(tag.id)} className="p-1 text-ink-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      )}
    </div>
  )
}
