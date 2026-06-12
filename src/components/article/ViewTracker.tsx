'use client'

import { useEffect } from 'react'

interface Props {
  articleId: string
}

export function ViewTracker({ articleId }: Props) {
  useEffect(() => {
    // Track view instantly when article opens
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId }),
    }).catch(() => {})
  }, [articleId])

  return null
}