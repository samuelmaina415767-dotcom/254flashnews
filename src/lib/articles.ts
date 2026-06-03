import { createServerClientInstance } from '@/lib/supabase-server'
import type { Article, ArticleWithRelations, PaginatedResult } from '@/types'

const ARTICLE_SELECT = `
  *,
  author:profiles(*),
  category:categories(*),
  tags:article_tags(tag:tags(*))
`

export async function getPublishedArticles(
  page = 1,
  pageSize = 10,
  categorySlug?: string
): Promise<PaginatedResult<ArticleWithRelations>> {
  const supabase = await createServerClientInstance()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('articles')
    .select(ARTICLE_SELECT, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle()

    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data, count, error } = await query
  if (error) throw error

  return {
    data: (data || []) as ArticleWithRelations[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}

export async function getFeaturedArticles(limit = 5): Promise<ArticleWithRelations[]> {
  const supabase = await createServerClientInstance()

  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data || []) as ArticleWithRelations[]
}

export async function getTrendingArticles(limit = 6): Promise<ArticleWithRelations[]> {
  const supabase = await createServerClientInstance()

  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data || []) as ArticleWithRelations[]
}

export async function getBreakingNews(): Promise<Article[]> {
  const supabase = await createServerClientInstance()

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .limit(1)

  console.log('BREAKING NEWS DATA:', data)
  console.log('BREAKING NEWS ERROR:', error)

  if (error) throw error

  return []
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithRelations | null> {
  const supabase = await createServerClientInstance()

  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) return null
  return (data || null) as ArticleWithRelations | null
}

export async function getRelatedArticles(
  articleId: string,
  categoryId: string | null,
  limit = 3
): Promise<ArticleWithRelations[]> {
  const supabase = await createServerClientInstance()

  let query = supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('status', 'published')
    .neq('id', articleId)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data } = await query
  return (data || []) as ArticleWithRelations[]
}

export async function getPrevNextArticles(publishedAt: string) {
  const supabase = await createServerClientInstance()

  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from('articles')
      .select('id, title, slug, featured_image_url')
      .eq('status', 'published')
      .lt('published_at', publishedAt)
      .order('published_at', { ascending: false })
      .limit(1),

    supabase
      .from('articles')
      .select('id, title, slug, featured_image_url')
      .eq('status', 'published')
      .gt('published_at', publishedAt)
      .order('published_at', { ascending: true })
      .limit(1),
  ])

  return {
    prev: prevRes.data?.[0] || null,
    next: nextRes.data?.[0] || null,
  }
}

export async function searchArticles(
  query: string,
  page = 1,
  pageSize = 10
): Promise<PaginatedResult<ArticleWithRelations>> {
  const supabase = await createServerClientInstance()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count, error } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT, { count: 'exact' })
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data || []) as ArticleWithRelations[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}

export async function incrementViewCount(articleId: string) {
  const supabase = await createServerClientInstance()
  await supabase.rpc('increment_view_count', { article_id: articleId })
}

// Admin queries
export async function getAllArticlesAdmin(
  page = 1,
  pageSize = 20
): Promise<PaginatedResult<ArticleWithRelations>> {
  const supabase = await createServerClientInstance()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count, error } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data || []) as ArticleWithRelations[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  }
}

export async function getArticleByIdAdmin(id: string): Promise<ArticleWithRelations | null> {
  const supabase = await createServerClientInstance()

  const { data } = await supabase
    .from('articles')
    .select(ARTICLE_SELECT)
    .eq('id', id)
    .maybeSingle()

  return (data || null) as ArticleWithRelations | null
}