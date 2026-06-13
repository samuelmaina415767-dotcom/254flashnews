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
    toast.success('Link copied!')
  }

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-sm font-semibold text-ink-700 dark:text-ink-300">
          {label}
        </p>
      )}
      
        href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1da851] transition-all duration-200 shadow-md"
      >
        <MessageCircle className="w-5 h-5" />
        Share on WhatsApp
      </a>
      <div className="flex items-center gap-2 flex-wrap">
        
          href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 text-xs font-medium hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-200"
        >
          <Facebook className="w-3.5 h-3.5" />
          <span>Facebook</span>
        </a>
        
          href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 text-xs font-medium hover:bg-black hover:text-white hover:border-black transition-all duration-200"
        >
          <Twitter className="w-3.5 h-3.5" />
          <span>X / Twitter</span>
        </a>
        
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 text-xs font-medium hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all duration-200"
        >
          <Linkedin className="w-3.5 h-3.5" />
          <span>LinkedIn</span>
        </a>
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-700 text-ink-600 dark:text-ink-400 text-xs font-medium hover:bg-ink-100 dark:hover:bg-ink-800 transition-all duration-200"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Copy Link</span>
        </button>
      </div>
    </div>
  )
}
