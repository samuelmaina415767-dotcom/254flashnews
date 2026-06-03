import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Twitter, Linkedin, Globe } from 'lucide-react'
import { createServerClientInstance } from '@/lib/supabase-server'
import { getPublishedArticles } from '@/lib/articles'
import { ArticleCard } from '@/components/article/ArticleCard'

interface Props {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const displayName = name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return { title: displayName, description: `Articles by ${displayName}` }
}

export default async function AuthorPage({ params }: Props) {
  const { name } = await params
  const supabase = await createServerClientInstance()

  // Find profile by name slug
  const { data: profiles } = await supabase.from('profiles').select('*')
  const profile = profiles?.find(
    (p) => p.full_name.toLowerCase().replace(/\s+/g, '-') === name
  )

  if (!profile) notFound()

  // Get their articles
  const { data: articles } = await supabase
    .from('articles')
    .select('*, author:profiles(*), category:categories(*), tags:article_tags(tag:tags(*))')
    .eq('author_id', profile.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Author header */}
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12 pb-12 border-b border-ink-200 dark:border-ink-800">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.full_name}
            width={120}
            height={120}
            className="rounded-full object-cover ring-4 ring-ink-100 dark:ring-ink-800 shrink-0"
          />
        ) : (
          <div className="w-24 h-24 md:w-[120px] md:h-[120px] rounded-full bg-gradient-to-br from-ink-200 to-ink-400 dark:from-ink-700 dark:to-ink-900 flex items-center justify-center text-4xl font-serif font-bold text-ink-600 dark:text-ink-400 shrink-0">
            {profile.full_name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Author</p>
          <h1 className="font-serif text-4xl font-bold text-ink-950 dark:text-ink-50">{profile.full_name}</h1>
          {profile.bio && (
            <p className="text-ink-600 dark:text-ink-400 mt-3 max-w-2xl leading-relaxed">{profile.bio}</p>
          )}
          <div className="flex items-center gap-3 mt-4">
            {profile.twitter_url && (
              <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-accent transition-colors">
                <Twitter className="w-4 h-4" /> Twitter
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-accent transition-colors">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-accent transition-colors">
                <Globe className="w-4 h-4" /> Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Their articles */}
      <h2 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100 mb-6">
        Articles by {profile.full_name}
        <span className="text-sm font-sans font-normal text-ink-500 ml-2">({articles?.length || 0})</span>
      </h2>

      {!articles || articles.length === 0 ? (
        <p className="text-ink-500 text-center py-16 font-serif text-xl">No published articles yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article as any} />
          ))}
        </div>
      )}
    </div>
  )
}
