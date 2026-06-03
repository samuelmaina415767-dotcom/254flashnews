'use client'

import { useState } from 'react'
import { Bell, User, LogOut, ChevronDown, Plus } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Props { user: SupabaseUser }

export function AdminHeader({ user }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <header className="bg-white dark:bg-ink-950 border-b border-ink-200 dark:border-ink-800 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Link href="/admin/articles/new" className="btn-primary py-2 text-sm">
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-ink-700 dark:text-ink-300 max-w-[120px] truncate hidden sm:block">
              {user.email}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-ink-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-ink-100 dark:border-ink-800 mb-2">
                <p className="text-xs text-ink-500">Signed in as</p>
                <p className="text-sm font-medium text-ink-800 dark:text-ink-200 truncate">{user.email}</p>
              </div>
              <Link href="/admin/authors" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors">
                <User className="w-4 h-4" /> Profile
              </Link>
              <button onClick={signOut} className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
