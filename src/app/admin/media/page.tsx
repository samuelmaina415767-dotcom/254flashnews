'use client'

import { useState, useEffect, useCallback } from 'react'
import { Upload, Trash2, Copy, Loader2, Search, Image as ImageIcon, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatFileSize } from '@/lib/utils'
import toast from 'react-hot-toast'

interface MediaFile {
  name: string
  id: string
  updated_at: string
  metadata: { size: number; mimetype: string; cacheControl: string } | null
  publicUrl: string
}

export default function MediaAdminPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<MediaFile | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const supabase = createClient()

  async function load() {
    const { data, error } = await supabase.storage.from('media-library').list('', {
      limit: 100, offset: 0, sortBy: { column: 'updated_at', order: 'desc' },
    })
    if (error) { toast.error('Failed to load media'); return }
    const enriched = (data || []).filter((f) => f.name !== '.emptyFolderPlaceholder').map((f) => ({
      ...f,
      publicUrl: supabase.storage.from('media-library').getPublicUrl(f.name).data.publicUrl,
    }))
    setFiles(enriched as MediaFile[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function uploadFiles(fileList: FileList) {
    setUploading(true)
    for (const file of Array.from(fileList)) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast.error(`${file.name}: unsupported format`)
        continue
      }
      const ext = file.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('media-library').upload(filename, file)
      if (error) toast.error(`Failed to upload ${file.name}`)
      else toast.success(`Uploaded ${file.name}`)
    }
    setUploading(false)
    load()
  }

  async function deleteFile(filename: string) {
    if (!confirm('Delete this file? This cannot be undone.')) return
    const { error } = await supabase.storage.from('media-library').remove([filename])
    if (error) { toast.error(error.message); return }
    toast.success('File deleted')
    if (selected?.name === filename) setSelected(null)
    load()
  }

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100">Media Library</h1>
          <p className="text-ink-500 text-sm mt-0.5">{files.length} files</p>
        </div>
        <label className="btn-primary cursor-pointer">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
        </label>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors ${dragOver ? 'border-accent bg-accent/5' : 'border-ink-200 dark:border-ink-800'}`}
      >
        <Upload className="w-8 h-8 text-ink-400 mx-auto mb-2" />
        <p className="text-sm text-ink-500">Drag and drop images here, or click Upload above</p>
        <p className="text-xs text-ink-400 mt-1">Supports JPG, PNG, WebP</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files…"
          className="form-input pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-ink-400" /></div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-20 text-ink-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-ink-300" />
          <p className="font-serif text-xl">{search ? 'No files match your search' : 'No media yet'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelected(file)}
              className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selected?.id === file.id ? 'border-accent shadow-lg scale-[1.02]' : 'border-transparent hover:border-ink-300 dark:hover:border-ink-600'}`}
            >
              <div className="aspect-square bg-ink-100 dark:bg-ink-800">
                <img
                  src={file.publicUrl}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3C/svg%3E' }}
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate">{file.name}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteFile(file.name) }}
                className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <div className="fixed right-0 top-0 h-full w-72 bg-white dark:bg-ink-900 border-l border-ink-200 dark:border-ink-800 shadow-2xl z-50 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-ink-200 dark:border-ink-800">
            <span className="font-semibold text-sm text-ink-800 dark:text-ink-200">File Details</span>
            <button onClick={() => setSelected(null)} className="p-1 text-ink-400 hover:text-ink-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <div className="aspect-video bg-ink-100 dark:bg-ink-800 rounded-lg overflow-hidden mb-4">
              <img src={selected.publicUrl} alt={selected.name} className="w-full h-full object-contain" />
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-0.5">Filename</p>
                <p className="text-ink-800 dark:text-ink-200 break-all font-mono text-xs">{selected.name}</p>
              </div>
              {selected.metadata?.size && (
                <div>
                  <p className="text-xs text-ink-500 uppercase tracking-wider mb-0.5">Size</p>
                  <p className="text-ink-800 dark:text-ink-200">{formatFileSize(selected.metadata.size)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-0.5">URL</p>
                <p className="text-ink-600 dark:text-ink-400 text-xs break-all">{selected.publicUrl}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => { navigator.clipboard.writeText(selected.publicUrl); toast.success('URL copied!') }}
                className="btn-primary w-full justify-center text-sm py-2"
              >
                <Copy className="w-3.5 h-3.5" /> Copy URL
              </button>
              <button
                onClick={() => deleteFile(selected.name)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm text-red-600 border border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
