'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this article? This cannot be undone.')) return

    const { error } = await supabase.from('articles').delete().eq('id', articleId)
    if (error) {
      toast.error('Failed to delete article')
      return
    }
    toast.success('Article deleted')
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="p-1.5 text-ink-400 hover:text-red-500 transition-colors" title="Delete">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}
