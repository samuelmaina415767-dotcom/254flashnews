'use client'

import { Facebook, Twitter, Linkedin, Link2, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  url: string
  title: string
  label?: string
}

export function SocialShare({ url, title, label }: Props) {
  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  const shares = [
    {
      label: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      color: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
    },
    {
      label: 'X / Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      color: 'hover:bg-black hover:text-white hover:border-black',
    },
    {
      label: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${encodedTitle}`,
      color: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
    },
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
      color: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
    },
  ]

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {label && <span className="text-sm font-medium text-ink-600 dark:text-ink-400 mr-1">{label}</span>}
      {shares.map(({ label, icon: Icon, href, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 text-xs font-medium transition-all duration-200 ${color}`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </a>
      ))}
      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 text-xs font-medium hover:bg-ink-100 dark:hover:bg-ink-800 transition-all duration-200"
      >
        <Link2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Copy Link</span>
      </button>
    </div>
  )
}
