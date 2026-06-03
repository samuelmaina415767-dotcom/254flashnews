'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Image from 'next/image'
import type { Profile } from '@/types'

export default function AuthorsAdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    full_name: '', bio: '', avatar_url: '',
    twitter_url: '', linkedin_url: '', website_url: '',
  })
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setForm({
          full_name: data.full_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          twitter_url: data.twitter_url || '',
          linkedin_url: data.linkedin_url || '',
          website_url: data.website_url || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const filename = `avatar-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('author-images').upload(filename, file, { upsert: true })
    if (error) { toast.error('Upload failed'); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('author-images').getPublicUrl(filename)
    setForm((f) => ({ ...f, avatar_url: publicUrl }))
    toast.success('Photo uploaded!')
    setUploading(false)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...form, role: profile?.role || 'admin' })
    if (error) { toast.error(error.message) } else { toast.success('Profile saved!') }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-ink-400" /></div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100">Author Profile</h1>
        <p className="text-ink-500 text-sm mt-0.5">Your public author profile</p>
      </div>

      <form onSubmit={save} className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-start gap-6">
          <div className="relative">
            {form.avatar_url ? (
              <Image src={form.avatar_url} alt="Avatar" width={96} height={96} className="rounded-full object-cover ring-2 ring-ink-200 dark:ring-ink-700" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-ink-200 dark:bg-ink-700 flex items-center justify-center text-3xl font-serif font-bold text-ink-500">
                {form.full_name?.charAt(0) || 'A'}
              </div>
            )}
          </div>
          <div>
            <label className="btn-secondary cursor-pointer text-sm py-2">
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> Upload Photo</>}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
            <p className="text-xs text-ink-400 mt-2">JPG, PNG or WebP. Recommended: 200×200px</p>
          </div>
        </div>

        {/* Basic info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Full Name *</label>
            <input
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              className="form-input"
              placeholder="Jane Smith"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={4}
              className="form-input resize-none"
              placeholder="A brief bio that appears on your articles and author page…"
            />
          </div>
        </div>

        {/* Social links */}
        <div>
          <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300 mb-3">Social Links</h3>
          <div className="space-y-3">
            {[
              { key: 'twitter_url', label: 'X / Twitter', placeholder: 'https://twitter.com/yourhandle' },
              { key: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourname' },
              { key: 'website_url', label: 'Website', placeholder: 'https://yourwebsite.com' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-ink-600 dark:text-ink-400 mb-1">{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="form-input text-sm"
                  placeholder={placeholder}
                  type="url"
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
