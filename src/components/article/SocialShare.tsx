'use client'

import { MessageCircle, Facebook, Twitter, Link2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  url: string
  title: string
  label?: string
}

export function SocialShare({ url, title, label }: Props) {
  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    toast.success('Link copied!')
  }

  const waUrl = 'https://wa.me/?text=' + encodeURIComponent(title) + '%20' + encodeURIComponent(url)
  const fbUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)
  const twUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url)

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-semibold">{label}</p>}
      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm">
        <MessageCircle className="w-5 h-5" />
        Share on WhatsApp
      </a>
      <div className="flex gap-2 flex-wrap">
        <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium hover:bg-[#1877F2] hover:text-white">
          <Facebook className="w-3.5 h-3.5" />
          <span>Facebook</span>
        </a>
        <a href={twUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium hover:bg-black hover:text-white">
          <Twitter className="w-3.5 h-3.5" />
          <span>Twitter</span>
        </a>
        <button onClick={copyLink} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium hover:bg-gray-100">
          <Link2 className="w-3.5 h-3.5" />
          <span>Copy Link</span>
        </button>
      </div>
    </div>
  )
}
