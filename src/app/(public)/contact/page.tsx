'use client'

import { useState } from 'react'
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">Contact</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink-950 dark:text-ink-50 mb-4">
          Get in Touch
        </h1>
        <p className="text-ink-600 dark:text-ink-400 text-lg">
          Have a story tip, correction, or want to collaborate? We'd love to hear from you.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Mail, title: 'Email', value: 'editor@yoursite.com', href: 'mailto:editor@yoursite.com' },
          { icon: MessageSquare, title: 'Story Tips', value: 'tips@yoursite.com', href: 'mailto:tips@yoursite.com' },
        ].map(({ icon: Icon, title, value, href }) => (
          <a key={title} href={href} className="flex items-center gap-3 p-4 bg-ink-50 dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 hover:border-accent transition-colors">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Icon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider">{title}</p>
              <p className="text-sm text-ink-800 dark:text-ink-200">{value}</p>
            </div>
          </a>
        ))}
      </div>

      {submitted ? (
        <div className="text-center py-16 bg-green-50 dark:bg-green-950/20 rounded-2xl border border-green-200 dark:border-green-900">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100 mb-2">Message Sent!</h2>
          <p className="text-ink-600 dark:text-ink-400">Thank you for reaching out. We'll get back to you within 24–48 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-ink-900 p-8 rounded-2xl border border-ink-200 dark:border-ink-800 shadow-sm">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Full Name *</label>
              <input id="name" name="name" required className="form-input" placeholder="Jane Smith" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Email Address *</label>
              <input id="email" name="email" type="email" required className="form-input" placeholder="jane@example.com" />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Subject *</label>
            <input id="subject" name="subject" required className="form-input" placeholder="What is this about?" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Message *</label>
            <textarea id="message" name="message" required rows={6} className="form-input resize-none" placeholder="Your message…" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 justify-center">
            <Send className="w-4 h-4" />
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
