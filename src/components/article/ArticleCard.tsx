import Image from 'next/image'
import Link from 'next/link'
import { Clock, Eye } from 'lucide-react'
import { formatDate, formatRelativeDate } from '@/lib/utils'
import type { ArticleWithRelations } from '@/types'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  article: ArticleWithRelations
  variant?: 'default' | 'hero' | 'compact' | 'horizontal'
  className?: string
}

export function ArticleCard({ article, variant = 'default', className }: ArticleCardProps) {
  const url = `/article/${article.slug}`

  if (variant === 'hero') {
    return (
      <article className={cn('relative group overflow-hidden rounded-xl', className)}>
        <div className="relative aspect-[16/9] md:aspect-[21/9]">
          {article.featured_image_url ? (
            <Image
              src={article.featured_image_url}
              alt={article.featured_image_alt || article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-ink-800 to-ink-950" />
          )}
          <div className="img-overlay" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            {article.is_breaking && (
              <span className="badge-breaking mb-3 w-fit">Breaking</span>
            )}
            {article.category && (
              <Link href={`/category/${article.category.slug}`}>
                <span className="badge-category bg-accent text-white mb-3 w-fit hover:bg-accent-700 transition-colors">
                  {article.category.name}
                </span>
              </Link>
            )}
            <Link href={url}>
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-white leading-tight hover:text-accent-200 transition-colors line-clamp-3">
                {article.title}
              </h2>
            </Link>
            {article.subtitle && (
              <p className="text-ink-200 mt-2 text-sm md:text-base line-clamp-2 max-w-2xl">
                {article.subtitle}
              </p>
            )}
            <div className="flex items-center gap-4 mt-4 text-ink-300 text-sm">
              {article.author && (
              <span className="font-medium text-ink-700 dark:text-ink-300">
  {(article as any).guest_author_name || article.author?.full_name}
</span>
              )}
              {article.published_at && (
                <time>{formatDate(article.published_at, 'MMM d, yyyy')}</time>
              )}
              {article.reading_time && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.reading_time} min read
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <article className={cn('flex gap-4 group', className)}>
        {article.featured_image_url && (
          <Link href={url} className="shrink-0">
            <div className="relative w-24 h-20 md:w-32 md:h-24 rounded-lg overflow-hidden">
              <Image
                src={article.featured_image_url}
                alt={article.featured_image_alt || article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="128px"
              />
            </div>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          {article.category && (
            <Link href={`/category/${article.category.slug}`}>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent hover:text-accent-700 transition-colors">
                {article.category.name}
              </span>
            </Link>
          )}
          <Link href={url}>
            <h3 className="font-serif font-semibold text-ink-900 dark:text-ink-100 line-clamp-2 mt-0.5 leading-snug hover:text-accent dark:hover:text-accent-400 transition-colors text-sm md:text-base">
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-ink-500">
            {article.published_at && <time>{formatRelativeDate(article.published_at)}</time>}
            {article.reading_time && (
              <>
                <span>·</span>
                <span>{article.reading_time} min</span>
              </>
            )}
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className={cn('group', className)}>
        <Link href={url} className="block relative aspect-video rounded-lg overflow-hidden mb-3">
          {article.featured_image_url ? (
            <Image
              src={article.featured_image_url}
              alt={article.featured_image_alt || article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 bg-ink-200 dark:bg-ink-800" />
          )}
        </Link>
        {article.category && (
          <Link href={`/category/${article.category.slug}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-700 transition-colors">
              {article.category.name}
            </span>
          </Link>
        )}
        <Link href={url}>
          <h3 className="font-serif font-bold text-ink-900 dark:text-ink-100 line-clamp-2 mt-1 leading-snug hover:text-accent dark:hover:text-accent-400 transition-colors">
            {article.title}
          </h3>
        </Link>
        <time className="text-xs text-ink-500 mt-1.5 block">
          {article.published_at ? formatDate(article.published_at, 'MMM d') : ''}
        </time>
      </article>
    )
  }

  // Default card
  return (
    <article className={cn('group flex flex-col', className)}>
      <Link href={url} className="block relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
        {article.featured_image_url ? (
          <Image
            src={article.featured_image_url}
            alt={article.featured_image_alt || article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-900" />
        )}
        {article.is_breaking && (
          <div className="absolute top-3 left-3">
            <span className="badge-breaking">Breaking</span>
          </div>
        )}
      </Link>

      <div className="flex-1 flex flex-col">
        {article.category && (
          <Link href={`/category/${article.category.slug}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-700 transition-colors">
              {article.category.name}
            </span>
          </Link>
        )}
        <Link href={url}>
          <h2 className="font-serif text-xl font-bold text-ink-900 dark:text-ink-100 mt-1.5 leading-snug hover:text-accent dark:hover:text-accent-400 transition-colors line-clamp-2">
            {article.title}
          </h2>
        </Link>
        {article.excerpt && (
          <p className="text-ink-600 dark:text-ink-400 text-sm mt-2 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-4 text-xs text-ink-500">
          <div className="flex items-center gap-2">
            {article.author && (
            <span className="font-medium text-ink-700 dark:text-ink-300">
  {(article as any).guest_author_name || article.author?.full_name}
</span>
            )}
            {article.published_at && (
              <>
                <span>·</span>
                <time>{formatDate(article.published_at, 'MMM d, yyyy')}</time>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {article.reading_time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.reading_time}m
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
