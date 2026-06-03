'use client'

import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  variant?: 'sidebar' | 'inline'
}

export function NewsletterForm({ variant = 'sidebar' }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setSubscribed(true)
      toast.success('You\'re subscribed!')
    } catch {
      toast.error('Subscription failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 text-green-400 text-sm py-2">
        <CheckCircle className="w-4 h-4 shrink-0" />
        <span>You're subscribed — thank you!</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="w-full px-3 py-2.5 rounded-lg bg-ink-800 border border-ink-700 text-white placeholder-ink-500 focus:outline-none focus:border-accent text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center py-2.5"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {loading ? 'Subscribing…' : 'Subscribe Free'}
      </button>
    </form>
  )
}
