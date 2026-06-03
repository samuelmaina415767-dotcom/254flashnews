import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, pattern = 'MMMM d, yyyy') {
  return format(parseISO(dateString), pattern)
}

export function formatRelativeDate(dateString: string) {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true })
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '…'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getArticleUrl(slug: string): string {
  return `/article/${slug}`
}

export function getCategoryUrl(slug: string): string {
  return `/category/${slug}`
}

export function getAuthorUrl(name: string): string {
  return `/author/${name.toLowerCase().replace(/\s+/g, '-')}`
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'
}

export function buildOpenGraphUrl(params: Record<string, string>): string {
  const query = new URLSearchParams(params).toString()
  return `${getSiteUrl()}/api/og?${query}`
}

export const CATEGORIES = [
  { name: 'News', slug: 'news' },
  { name: 'Features', slug: 'features' },
  { name: 'Opinion', slug: 'opinion' },
  { name: 'Politics', slug: 'politics' },
  { name: 'Business', slug: 'business' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Lifestyle', slug: 'lifestyle' },
  { name: 'Church', slug: 'church' },
]
