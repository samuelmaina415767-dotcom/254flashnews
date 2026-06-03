import { createServerClientInstance } from '@/lib/supabase-server'
import { BarChart3, TrendingUp, Eye, FileText } from 'lucide-react'
import Link from 'next/link'

export default async function AnalyticsPage() {
  const supabase = await createServerClientInstance()

  const [
    { data: topArticles },
    { data: categoryStats },
    { count: totalViews },
  ] = await Promise.all([
    supabase
      .from('articles')
      .select('id, title, slug, view_count, published_at, category:categories(name)')
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(10),
    supabase
      .from('articles')
      .select('category:categories(name, slug), view_count')
      .eq('status', 'published')
      .not('category_id', 'is', null),
    supabase.from('articles').select('view_count', { count: 'exact', head: true }).eq('status', 'published'),
  ])

  // Aggregate category stats
  const catMap: Record<string, { name: string; views: number; count: number }> = {}
  for (const a of categoryStats || []) {
    const cat = a.category as any
    if (!cat) continue
    if (!catMap[cat.slug]) catMap[cat.slug] = { name: cat.name, views: 0, count: 0 }
    catMap[cat.slug].views += a.view_count || 0
    catMap[cat.slug].count++
  }
  const topCategories = Object.values(catMap).sort((a, b) => b.views - a.views).slice(0, 6)
  const maxViews = Math.max(...topCategories.map((c) => c.views), 1)

  const totalViewCount = (topArticles || []).reduce((sum, a) => sum + (a.view_count || 0), 0)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100">Analytics</h1>
        <p className="text-ink-500 text-sm mt-0.5">Content performance overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Views', value: totalViewCount.toLocaleString(), icon: Eye, color: 'text-accent' },
          { label: 'Top Article Views', value: (topArticles?.[0]?.view_count || 0).toLocaleString(), icon: TrendingUp, color: 'text-green-500' },
          { label: 'Tracked Articles', value: topArticles?.length || 0, icon: FileText, color: 'text-blue-500' },
          { label: 'Categories', value: topCategories.length, icon: BarChart3, color: 'text-purple-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-5">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${color}`} />
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</p>
            </div>
            <p className="text-2xl font-bold text-ink-900 dark:text-ink-100">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top articles */}
        <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 overflow-hidden">
          <div className="p-5 border-b border-ink-100 dark:border-ink-800">
            <h2 className="font-semibold text-ink-900 dark:text-ink-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" /> Top Articles by Views
            </h2>
          </div>
          <div className="divide-y divide-ink-100 dark:divide-ink-800">
            {(topArticles || []).map((article, i) => (
              <div key={article.id} className="flex items-center gap-4 px-5 py-3">
                <span className="text-xl font-serif font-bold text-ink-200 dark:text-ink-800 w-6 text-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/article/${article.slug}`}
                    target="_blank"
                    className="text-sm font-medium text-ink-800 dark:text-ink-200 line-clamp-1 hover:text-accent transition-colors"
                  >
                    {article.title}
                  </Link>
                  {(article.category as any)?.name && (
                    <p className="text-xs text-ink-400 mt-0.5">{(article.category as any).name}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-ink-500 shrink-0 font-medium">
                  <Eye className="w-3 h-3" />
                  {(article.view_count || 0).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category performance */}
        <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 overflow-hidden">
          <div className="p-5 border-b border-ink-100 dark:border-ink-800">
            <h2 className="font-semibold text-ink-900 dark:text-ink-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent" /> Views by Category
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {topCategories.length === 0 ? (
              <p className="text-center text-ink-500 text-sm py-8">No category data yet</p>
            ) : (
              topCategories.map(({ name, views, count }) => (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-ink-800 dark:text-ink-200">{name}</span>
                    <div className="flex items-center gap-3 text-xs text-ink-500">
                      <span>{count} articles</span>
                      <span className="font-medium text-ink-700 dark:text-ink-300">{views.toLocaleString()} views</span>
                    </div>
                  </div>
                  <div className="h-2 bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${Math.max((views / maxViews) * 100, 2)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-ink-400 mt-6 text-center">
        Analytics data updates in real-time as articles are viewed.
      </p>
    </div>
  )
}
