'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Loader2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Category } from '@/types'

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Category | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '', description: '', color: '#c41e3a' })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  async function load() {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function startCreate() {
    setEditing(null)
    setForm({ name: '', slug: '', description: '', color: '#c41e3a' })
    setCreating(true)
  }

  function startEdit(cat: Category) {
    setCreating(false)
    setEditing(cat)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', color: cat.color || '#c41e3a' })
  }

  async function save() {
    if (!form.name.trim()) { toast.error('Name required'); return }
    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.name) }
    if (editing) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editing.id)
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success('Category updated')
    } else {
      const { error } = await supabase.from('categories').insert(payload)
      if (error) { toast.error(error.message); setSaving(false); return }
      toast.success('Category created')
    }
    setEditing(null)
    setCreating(false)
    setSaving(false)
    load()
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category? Articles using it will be uncategorized.')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Deleted')
    load()
  }

  const showForm = creating || editing !== null

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100">Categories</h1>
          <p className="text-ink-500 text-sm mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={startCreate} className="btn-primary">
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-6 mb-6">
          <h2 className="font-semibold text-ink-800 dark:text-ink-200 mb-4">
            {editing ? 'Edit Category' : 'New Category'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                className="form-input"
                placeholder="e.g. Technology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                className="form-input font-mono text-sm"
                placeholder="auto-generated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Description</label>
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="form-input"
                placeholder="Optional description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="w-10 h-10 rounded cursor-pointer border border-ink-300" />
                <input value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="form-input flex-1 font-mono text-sm" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setCreating(false) }} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-ink-400" /></div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-ink-500">
            <p className="font-serif text-xl mb-2">No categories yet</p>
            <button onClick={startCreate} className="btn-primary mt-4">Create first category</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 dark:border-ink-800 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider hidden md:table-cell">Slug</th>
                <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider hidden md:table-cell">Description</th>
                <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-ink-50 dark:hover:bg-ink-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color || '#c41e3a' }} />
                      <span className="font-medium text-ink-900 dark:text-ink-100">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-ink-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-ink-500 text-xs">{cat.description || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(cat)} className="p-1.5 text-ink-400 hover:text-accent transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-ink-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
