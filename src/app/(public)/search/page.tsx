import { Suspense } from 'react'
import { Search } from 'lucide-react'
import { searchArticles } from '@/lib/articles'
import { ArticleCard } from '@/components/article/ArticleCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search all stories and articles',
}

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page: pageStr } = await searchParams
  const query = q?.trim() || ''
  const page = parseInt(pageStr || '1', 10)

  const results = query ? await searchArticles(query, page) : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-ink-950 dark:text-ink-50 mb-8">Search</h1>

      <form method="get" className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search stories, topics, authors…"
          className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-ink-900 dark:text-ink-100 focus:outline-none focus:border-accent transition-colors"
          autoFocus
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary py-2">
          Search
        </button>
      </form>

      {query && results && (
        <div>
          <p className="text-sm text-ink-500 mb-6">
            {results.count === 0
              ? `No results found for "${query}"`
              : `${results.count} result${results.count !== 1 ? 's' : ''} for "${query}"`}
          </p>

          {results.data.length > 0 ? (
            <>
              <div className="space-y-6">
                {results.data.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" className="border-b border-ink-200 dark:border-ink-800 pb-6 last:border-0" />
                ))}
              </div>
              {results.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {page > 1 && <a href={`?q=${encodeURIComponent(query)}&page=${page - 1}`} className="btn-secondary">← Previous</a>}
                  <span className="text-sm text-ink-500 flex items-center px-4">Page {page} of {results.totalPages}</span>
                  {page < results.totalPages && <a href={`?q=${encodeURIComponent(query)}&page=${page + 1}`} className="btn-secondary">Next →</a>}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-ink-500">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-serif text-xl mb-2">Nothing found</p>
              <p className="text-sm">Try different keywords or browse by category.</p>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-16 text-ink-500">
          <p className="font-serif text-xl mb-2">What are you looking for?</p>
          <p className="text-sm">Enter a keyword, topic, or person's name above.</p>
        </div>
      )}
    </div>
  )
}
