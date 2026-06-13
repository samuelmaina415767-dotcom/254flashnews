import { SocialShare } from '@/components/article/SocialShare'
import { notFound } from 'next/navigation'
import { ViewTracker } from '@/components/article/ViewTracker'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Clock, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { getArticleBySlug, getRelatedArticles, getPrevNextArticles } from '@/lib/articles'
import { formatDate, getSiteUrl } from '@/lib/utils'
import { ArticleCard } from '@/components/article/ArticleCard'
import { AuthorCard } from '@/components/article/AuthorCard'
import { NewsletterForm } from '@/components/shared/NewsletterForm'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  const url = `${getSiteUrl()}/article/${slug}`
  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt || '',
    keywords: article.meta_keywords || '',
    authors: article.author ? [{ name: article.author.full_name }] : [],
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt || '',
      url,
      type: 'article',
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at,
      authors: article.author ? [article.author.full_name] : [],
      images: article.featured_image_url
        ? [{ url: article.featured_image_url, alt: article.title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt || '',
      images: article.featured_image_url ? [article.featured_image_url] : [],
    },
    alternates: { canonical: url },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const [related, { prev, next }] = await Promise.all([
    getRelatedArticles(article.id, article.category_id, 3),
    article.published_at
      ? getPrevNextArticles(article.published_at)
      : Promise.resolve({ prev: null, next: null }),
  ])

  const articleUrl = `${getSiteUrl()}/article/${slug}`

  return (
    <article className="max-w-7xl mx-auto px-4 py-8">
      <ViewTracker articleId={article.id} />
      <SocialShare url={articleUrl} title={article.title} label="Share this story:" />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-ink-500 mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        {article.category && (
          <>
            <Link href={`/category/${article.category.slug}`} className="hover:text-accent transition-colors">
              {article.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-ink-400 line-clamp-1">{article.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-10">

        {/* Main content */}
        <div className="lg:col-span-2">

          {/* Article header */}
          <header className="mb-8">
            {article.is_breaking && (
              <span className="badge-breaking mb-4 inline-block">Breaking News</span>
            )}
            {article.category && (
              <Link href={`/category/${article.category.slug}`}>
                <span className="badge-category bg-accent/10 text-accent dark:bg-accent/20 mb-4 block w-fit hover:bg-accent/20 transition-colors">
                  {article.category.name}
                </span>
              </Link>
            )}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-ink-950 dark:text-ink-50 leading-tight">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="font-serif text-xl md:text-2xl text-ink-600 dark:text-ink-400 mt-4 font-normal leading-relaxed italic">
                {article.subtitle}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-ink-200 dark:border-ink-800 text-sm text-ink-500">
              {article.author && (
                <Link
                  href={`/author/${article.author.full_name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-2.5 hover:text-accent transition-colors"
                >
                  {article.author.avatar_url ? (
                    <Image
                      src={article.author.avatar_url}
                      alt={article.author.full_name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-ink-200 dark:bg-ink-800 flex items-center justify-center text-xs font-bold text-ink-600 dark:text-ink-400">
                      {article.author.full_name.charAt(0)}
                    </div>
                  )}
                  <span className="font-semibold text-ink-800 dark:text-ink-200">
                    {article.author.full_name}
                  </span>
                </Link>
              )}
              <div className="flex items-center gap-4 text-xs text-ink-500">
                {article.published_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(article.published_at)}
                  </span>
                )}
                {article.reading_time && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {article.reading_time} min read
                  </span>
                )}
                {article.view_count > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {article.view_count.toLocaleString()} views
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* Featured image */}
          {article.featured_image_url && (
            <figure className="mb-8">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                <Image
                  src={article.featured_image_url}
                  alt={article.featured_image_alt || article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
              {article.featured_image_alt && (
                <figcaption className="text-center text-xs text-ink-500 mt-2 italic">
                  {article.featured_image_alt}
                </figcaption>
              )}
            </figure>
          )}

          {/* Social share top */}
          {/* Article body */}
          <div
            className="article-content mt-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-ink-200 dark:border-ink-800">
              <span className="text-sm text-ink-500 font-medium">Tags:</span>
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/search?tag=${tag.slug}`}
                  className="px-3 py-1 bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 rounded-full text-xs font-medium hover:bg-accent hover:text-white dark:hover:bg-accent transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Social share bottom */}
          <div className="mt-8">
          </div>

          {/* Author card */}
          {article.author && (
            <AuthorCard author={article.author} className="mt-10" />
          )}

          {/* Prev / Next */}
          {(prev || next) && (
            <nav className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-ink-200 dark:border-ink-800">
              {prev ? (
                <Link
                  href={`/article/${prev.slug}`}
                  className="group flex flex-col gap-1 p-4 rounded-xl border border-ink-200 dark:border-ink-800 hover:border-accent transition-colors"
                >
                  <span className="flex items-center gap-1 text-xs text-ink-500 font-medium">
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </span>
                  <span className="text-sm font-semibold font-serif text-ink-800 dark:text-ink-200 line-clamp-2 group-hover:text-accent transition-colors">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next && (
                <Link
                  href={`/article/${next.slug}`}
                  className="group flex flex-col gap-1 p-4 rounded-xl border border-ink-200 dark:border-ink-800 hover:border-accent transition-colors text-right"
                >
                  <span className="flex items-center justify-end gap-1 text-xs text-ink-500 font-medium">
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-sm font-semibold font-serif text-ink-800 dark:text-ink-200 line-clamp-2 group-hover:text-accent transition-colors">
                    {next.title}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">

          {/* Related stories */}
          {related.length > 0 && (
            <div>
              <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-ink-100 mb-4 pb-3 border-b-2 border-ink-900 dark:border-ink-100">
                Related Stories
              </h3>
              <div className="space-y-5">
                {related.map((r) => (
                  <ArticleCard
                    key={r.id}
                    article={r}
                    variant="horizontal"
                    className="pb-5 border-b border-ink-100 dark:border-ink-800 last:border-0 last:pb-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Newsletter */}
          <div className="bg-ink-900 rounded-xl p-6 text-white">
            <h3 className="font-serif text-xl font-bold mb-2">Get the Newsletter</h3>
            <p className="text-ink-400 text-sm mb-4">Daily briefings, straight to your inbox.</p>
            <NewsletterForm />
          </div>

        </aside>
      </div>

      {/* More articles */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100 mb-6 pb-3 border-b-2 border-ink-900 dark:border-ink-100">
            More Stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map((r) => (
              <ArticleCard key={r.id} article={r} />
            ))}
          </div>
        </section>
      )}

    </article>
  )
}