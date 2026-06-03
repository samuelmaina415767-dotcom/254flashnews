import Link from 'next/link'
import { ArticleCard } from '@/components/article/ArticleCard'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { NewsletterForm } from '@/components/shared/NewsletterForm'
import { getFeaturedArticles, getPublishedArticles, getTrendingArticles } from '@/lib/articles'
import { TrendingUp, Flame, ChevronRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/utils'

export const revalidate = 60

export default async function HomePage() {
  const [featured, { data: latest }, trending] = await Promise.all([
    getFeaturedArticles(5),
    getPublishedArticles(1, 12),
    getTrendingArticles(6),
  ])

  const heroArticle = featured[0] || latest[0]
  const secondaryFeatured = (featured.length > 1 ? featured.slice(1, 3) : latest.slice(0, 2))
  const latestArticles = latest.slice(0, 6)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Category nav strip */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-4 mb-8 border-b border-ink-200 dark:border-ink-800">
        {CATEGORIES.map(({ name, slug }) => (
          <Link
            key={slug}
            href={`/category/${slug}`}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-400 hover:border-accent hover:text-accent dark:hover:text-accent-400 transition-colors"
          >
            {name}
          </Link>
        ))}
      </div>

      {/* Hero section */}
      {heroArticle && (
        <section className="mb-12">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ArticleCard article={heroArticle} variant="hero" />
            </div>
            <div className="flex flex-col gap-4">
              {secondaryFeatured.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="horizontal"
                  className="border-b border-ink-200 dark:border-ink-800 pb-4 last:border-0 last:pb-0"
                />
              ))}
              {/* Trending sidebar */}
              <div className="border border-ink-200 dark:border-ink-800 rounded-xl p-4 mt-2">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4 text-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest text-ink-600 dark:text-ink-400">Trending Now</span>
                </div>
                <div className="space-y-3">
                  {trending.slice(0, 4).map((article, i) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.slug}`}
                      className="flex items-start gap-3 group"
                    >
                      <span className="text-2xl font-serif font-bold text-ink-200 dark:text-ink-800 leading-none mt-0.5 shrink-0 group-hover:text-accent transition-colors">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-medium text-ink-800 dark:text-ink-200 line-clamp-2 leading-snug group-hover:text-accent dark:group-hover:text-accent-400 transition-colors">
                        {article.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest stories */}
      <section className="mb-14">
        <SectionHeader title="Latest Stories" href="/category/news" icon={<ChevronRight className="w-5 h-5" />} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/category/news" className="btn-secondary">
            View All Stories
          </Link>
        </div>
      </section>

      {/* Trending section */}
      {trending.length > 0 && (
        <section className="mb-14">
          <SectionHeader title="Most Read" href="#" icon={<TrendingUp className="w-5 h-5 text-accent" />} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trending.map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-br from-ink-900 to-ink-950 rounded-2xl p-8 md:p-12 text-center my-14 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '10px 10px',
          }}
        />
        <div className="relative">
          <span className="badge-breaking mb-4 inline-block">Newsletter</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
            Never Miss a Story
          </h2>
          <p className="text-ink-400 mb-8 max-w-md mx-auto">
            Join thousands of readers who get the day's most important stories delivered to their inbox every morning.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>

    </div>
  )
}