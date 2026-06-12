'use client'

import { useEffect } from 'react'

interface Props {
  articleId: string
}

export function ViewTracker({ articleId }: Props) {
  useEffect(() => {
    // Track view after 5 seconds (means they actually read it)
    const timer = setTimeout(async () => {
      try {
        await fetch('/api/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articleId }),
        })
      } catch {
        // Silently fail
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [articleId])

  return null
}