import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArticleCard } from '@/components/article/ArticleCard'
import { getPublishedArticles } from '@/lib/articles'
import { createServerClientInstance } from '@/lib/supabase-server'
import { CATEGORIES } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIES.find((c) => c.slug === slug)
  if (!cat) return {}
  return {
    title: `${cat.name} News`,
    description: `Latest ${cat.name.toLowerCase()} stories and updates`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageStr } = await searchParams
  const page = parseInt(pageStr || '1', 10)

  const supabase = await createServerClientInstance()
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) {
    const knownCat = CATEGORIES.find((c) => c.slug === slug)
    if (!knownCat) notFound()
  }

  const { data: articles, count, totalPages } = await getPublishedArticles(page, 12, slug)
  const catName = category?.name || CATEGORIES.find((c) => c.slug === slug)?.name || slug

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-10 border-b-4 border-accent pb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Section</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink-950 dark:text-ink-50">{catName}</h1>
        {count !== undefined && (
          <p className="text-ink-500 mt-2 text-sm">{count} {count === 1 ? 'story' : 'stories'}</p>
        )}
      </header>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-ink-500">
          <p className="text-2xl font-serif mb-2">No stories yet</p>
          <p className="text-sm">Check back soon for updates in this section.</p>
        </div>
      ) : (
        <>
          {/* Hero + grid */}
          {page === 1 && articles[0] && (
            <div className="mb-10">
              <ArticleCard article={articles[0]} variant="hero" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(page === 1 ? articles.slice(1) : articles).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {page > 1 && (
                <a href={`?page=${page - 1}`} className="btn-secondary px-4 py-2 text-sm">← Previous</a>
              )}
              <span className="text-sm text-ink-500 px-4">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <a href={`?page=${page + 1}`} className="btn-secondary px-4 py-2 text-sm">Next →</a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
