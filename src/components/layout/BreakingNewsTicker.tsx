'use client'

import Link from 'next/link'
import type { Article } from '@/types'

interface Props {
  items: Pick<Article, 'id' | 'title' | 'slug'>[]
}

export function BreakingNewsTicker({ items }: Props) {
  if (!items.length) return null

  // Duplicate for seamless loop
  const allItems = [...items, ...items]

  return (
    <div className="bg-accent text-white py-1.5 overflow-hidden flex items-center gap-0">
      <span className="shrink-0 bg-white text-accent font-bold text-xs uppercase tracking-widest px-3 py-0.5 mr-3 z-10">
        Breaking
      </span>
      <div className="ticker-wrapper flex-1 relative">
        <div className="ticker-content flex items-center gap-8">
          {allItems.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              href={`/article/${item.slug}`}
              className="text-sm whitespace-nowrap hover:underline"
            >
              <span className="text-red-200 mr-2">▶</span>
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
