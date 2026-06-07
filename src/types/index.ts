// ============================================================
// CMS TypeScript Types
// ============================================================

export type ArticleStatus = 'draft' | 'published' | 'scheduled'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Profile {
  id: string
  full_name: string
  bio: string | null
  avatar_url: string | null
  role: 'admin' | 'editor' | 'author'
  twitter_url: string | null
  linkedin_url: string | null
  website_url: string | null
  created_at: string
}

export interface Article {
  id: string
  title: string
  subtitle: string | null
  slug: string
  content: string
  excerpt: string | null
  featured_image_url: string | null
  featured_image_alt: string | null
  status: ArticleStatus
  author_id: string
  category_id: string | null
  seo_title: string | null
  seo_description: string | null
  meta_keywords: string | null
  published_at: string | null
  scheduled_at: string | null
  updated_at: string
  created_at: string
  view_count: number
  is_featured: boolean
  is_breaking: boolean
  reading_time: number | null
  // Relations (joined)
  author?: Profile
  category?: Category
  tags?: Tag[]
}

export interface ArticleWithRelations extends Omit<Article, 'category'> {
  author: Profile
  category: Category | null
  tags: Tag[]
}

export interface Media {
  id: string
  filename: string
  original_filename: string
  url: string
  size: number
  mime_type: string
  width: number | null
  height: number | null
  alt_text: string | null
  uploaded_by: string
  created_at: string
}

export interface Comment {
  id: string
  article_id: string
  author_name: string
  author_email: string
  content: string
  is_approved: boolean
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name: string | null
  is_active: boolean
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export interface DashboardStats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalViews: number
  popularArticles: Article[]
  recentActivity: Article[]
}

export interface SearchResult {
  id: string
  title: string
  excerpt: string | null
  slug: string
  category: Category | null
  published_at: string | null
  featured_image_url: string | null
}

export interface PaginatedResult<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}
