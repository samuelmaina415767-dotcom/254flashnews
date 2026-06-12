'use client'

import { Facebook, Twitter, Linkedin, Link2 } from 'lucide-react'
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
      {label && <p className="text-sm font-semibold text-ink-700 dark:text-ink-300">{label}</p>}

      {/* WhatsApp - BIG and prominent */}
      
        href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#1da851] transition-all duration-200 shadow-md"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Share on WhatsApp
      </a>

      {/* Other share buttons */}
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