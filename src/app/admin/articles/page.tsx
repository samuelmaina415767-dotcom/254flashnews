import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react'
import { getAllArticlesAdmin } from '@/lib/articles'
import { formatDate } from '@/lib/utils'
import { DeleteArticleButton } from '@/components/admin/DeleteArticleButton'

interface Props {
  searchParams: Promise<{ page?: string; status?: string }>
}

export default async function ArticlesAdminPage({ searchParams }: Props) {
  const { page: pageStr, status } = await searchParams
  const page = parseInt(pageStr || '1', 10)
  const { data: articles, count, totalPages } = await getAllArticlesAdmin(page, 20)

  const statusColor: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-amber-100 text-amber-700',
    scheduled: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100">Articles</h1>
          <p className="text-ink-500 text-sm mt-0.5">{count} total</p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary">
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 overflow-hidden">
        {/* Filter bar */}
        <div className="flex items-center gap-4 p-4 border-b border-ink-100 dark:border-ink-800">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input type="search" placeholder="Search articles…" className="form-input pl-9 py-2 text-sm" />
          </div>
          <div className="flex gap-1">
            {['all', 'published', 'draft', 'scheduled'].map((s) => (
              <Link
                key={s}
                href={s === 'all' ? '/admin/articles' : `/admin/articles?status=${s}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  (status || 'all') === s
                    ? 'bg-accent text-white'
                    : 'text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800'
                }`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 dark:border-ink-800 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Article</th>
                <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider hidden lg:table-cell">Views</th>
                <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-ink-50 dark:hover:bg-ink-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-ink-900 dark:text-ink-100 line-clamp-1">{article.title}</p>
                      {article.subtitle && (
                        <p className="text-xs text-ink-500 line-clamp-1 mt-0.5">{article.subtitle}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[article.status] || 'bg-ink-100 text-ink-700'}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-ink-600 dark:text-ink-400 text-xs">
                    {article.category?.name || '—'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-ink-600 dark:text-ink-400 text-xs">
                    {(article.view_count || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-ink-600 dark:text-ink-400 text-xs">
                    {formatDate(article.created_at, 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {article.status === 'published' && (
                        <Link href={`/article/${article.slug}`} target="_blank" className="p-1.5 text-ink-400 hover:text-green-600 transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <Link href={`/admin/articles/${article.id}/edit`} className="p-1.5 text-ink-400 hover:text-accent transition-colors" title="Edit">
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <DeleteArticleButton articleId={article.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {articles.length === 0 && (
          <div className="text-center py-16 text-ink-500">
            <p className="font-serif text-xl mb-2">No articles yet</p>
            <Link href="/admin/articles/new" className="btn-primary mt-4">Create your first article</Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 border-t border-ink-100 dark:border-ink-800">
            {page > 1 && <Link href={`?page=${page - 1}`} className="btn-secondary text-sm py-1.5">← Previous</Link>}
            <span className="text-sm text-ink-500">Page {page} of {totalPages}</span>
            {page < totalPages && <Link href={`?page=${page + 1}`} className="btn-secondary text-sm py-1.5">Next →</Link>}
          </div>
        )}
      </div>
    </div>
  )
}
