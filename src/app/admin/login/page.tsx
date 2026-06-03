'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Chronicle'

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 dark:bg-ink-950 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-ink-950 dark:text-ink-50">
            <span className="text-accent">{siteName.split(' ')[0]}</span>
            {siteName.split(' ').slice(1).join(' ') && ` ${siteName.split(' ').slice(1).join(' ')}`}
          </h1>
          <p className="text-xs text-ink-400 uppercase tracking-widest mt-1">Admin Portal</p>
        </div>

        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800 shadow-sm p-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mx-auto mb-6">
            <Lock className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-ink-900 dark:text-ink-100 text-center mb-1">Sign In</h2>
          <p className="text-sm text-ink-500 text-center mb-6">Access the CMS dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="form-input"
                placeholder="admin@yoursite.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="form-input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 justify-center mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-400 mt-6">
          © {new Date().getFullYear()} {siteName}. Authorized access only.
        </p>
      </div>
    </div>
  )
}
