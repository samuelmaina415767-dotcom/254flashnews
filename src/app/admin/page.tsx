import { redirect } from 'next/navigation'
import { createServerClientInstance } from '@/lib/supabase-server'
import { FileText, Eye, TrendingUp, CheckCircle, Clock, Edit } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function AdminDashboard() {
  const supabase = await createServerClientInstance()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const [
    { count: totalCount },
    { count: publishedCount },
    { count: draftCount },
    { data: recentArticles },
    { data: popularArticles },
  ] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('articles').select('id,title,slug,status,created_at,view_count').order('created_at', { ascending: false }).limit(5),
    supabase.from('articles').select('id,title,slug,view_count').eq('status', 'published').order('view_count', { ascending: false }).limit(5),
  ])

  const totalViews = (popularArticles || []).reduce((sum, a) => sum + (a.view_count || 0), 0)

  const stats = [
    { label: 'Total Articles', value: totalCount || 0, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Published', value: publishedCount || 0, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
    { label: 'Drafts', value: draftCount || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: 'text-accent', bg: 'bg-red-50 dark:bg-red-950/20' },
  ]

  const statusColor: Record<string, string> = {
    published: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
    draft: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink-900 dark:text-ink-100">Dashboard</h1>
        <p className="text-ink-500 mt-1 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-1">{label}</p>
                <p className="text-3xl font-bold text-ink-900 dark:text-ink-100">{value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-ink-100 dark:border-ink-800">
            <h2 className="font-semibold text-ink-900 dark:text-ink-100">Recent Articles</h2>
            <Link href="/admin/articles" className="text-xs text-accent hover:text-accent-700 font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-ink-100 dark:divide-ink-800">
            {(recentArticles || []).length === 0 && (
              <p className="text-sm text-ink-500 text-center py-8">No articles yet</p>
            )}
            {(recentArticles || []).map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 hover:bg-ink-50 dark:hover:bg-ink-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-800 dark:text-ink-200 line-clamp-1">{article.title}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{formatDate(article.created_at, 'MMM d, yyyy')}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[article.status] || ''}`}>
                    {article.status}
                  </span>
                  <Link href={`/admin/articles/${article.id}/edit`} className="p-1.5 text-ink-400 hover:text-accent transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular articles */}
        <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-ink-100 dark:border-ink-800">
            <h2 className="font-semibold text-ink-900 dark:text-ink-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" /> Most Viewed
            </h2>
          </div>
          <div className="divide-y divide-ink-100 dark:divide-ink-800">
            {(popularArticles || []).length === 0 && (
              <p className="text-sm text-ink-500 text-center py-8">No data yet</p>
            )}
            {(popularArticles || []).map((article, i) => (
              <div key={article.id} className="flex items-center gap-4 p-4">
                <span className="text-2xl font-serif font-bold text-ink-200 dark:text-ink-800 w-7 text-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Link href={`/article/${article.slug}`} target="_blank" className="text-sm font-medium text-ink-800 dark:text-ink-200 line-clamp-2 hover:text-accent transition-colors">
                    {article.title}
                  </Link>
                </div>
                <span className="flex items-center gap-1 text-xs text-ink-500 shrink-0">
                  <Eye className="w-3 h-3" />
                  {(article.view_count || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { href: '/admin/articles/new', label: 'New Article', icon: FileText },
          { href: '/admin/media', label: 'Upload Media', icon: TrendingUp },
          { href: '/admin/categories', label: 'Categories', icon: CheckCircle },
          { href: '/', label: 'View Site', icon: Eye },
        ].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl text-sm font-medium text-ink-700 dark:text-ink-300 hover:border-accent hover:text-accent transition-colors">
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}