'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Twitter, Linkedin, Globe } from 'lucide-react'
import type { Profile } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  author: Profile
  className?: string
}

export function AuthorCard({ author, className }: Props) {
  const authorUrl = `/author/${author.full_name.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={cn('flex gap-5 p-6 bg-ink-50 dark:bg-ink-900/50 rounded-xl border border-ink-200 dark:border-ink-800', className)}>
      <Link href={authorUrl} className="shrink-0">
        {author.avatar_url ? (
          <Image
            src={author.avatar_url}
            alt={author.full_name}
            width={72}
            height={72}
            className="rounded-full object-cover ring-2 ring-ink-200 dark:ring-ink-700"
          />
        ) : (
          <div className="w-18 h-18 rounded-full bg-ink-200 dark:bg-ink-700 flex items-center justify-center text-2xl font-bold text-ink-600">
            {author.full_name.charAt(0)}
          </div>
        )}
      </Link>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-ink-500">About the Author</span>
        </div>
        <Link href={authorUrl}>
          <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-ink-100 hover:text-accent transition-colors">
            {author.full_name}
          </h3>
        </Link>
        {author.bio && (
          <p className="text-sm text-ink-600 dark:text-ink-400 mt-1.5 leading-relaxed line-clamp-3">
            {author.bio}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          {author.twitter_url && (
            <a href={author.twitter_url} target="_blank" rel="noopener noreferrer" className="text-ink-500 hover:text-[#1DA1F2] transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {author.linkedin_url && (
            <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-ink-500 hover:text-[#0A66C2] transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {author.website_url && (
            <a href={author.website_url} target="_blank" rel="noopener noreferrer" className="text-ink-500 hover:text-accent transition-colors">
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
