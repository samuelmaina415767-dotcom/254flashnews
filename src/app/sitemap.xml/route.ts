import { getPublishedArticles } from '@/lib/articles'
import { getSiteUrl } from '@/lib/utils'
import { createServerClientInstance } from '@/lib/supabase-server'

export async function GET() {
  const siteUrl = getSiteUrl()
  const supabase = await createServerClientInstance()

  const [{ data: articles }, { data: categories }] = await Promise.all([
    getPublishedArticles(1, 1000),
    supabase.from('categories').select('slug, updated_at').order('name'),
  ])

  const staticPages = ['', '/about', '/contact', '/search']

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map((path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>daily</changefreq>
    <priority>${path === '' ? '1.0' : '0.7'}</priority>
  </url>`).join('')}
  ${(categories || []).map((cat) => `
  <url>
    <loc>${siteUrl}/category/${cat.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${(articles || []).map((article) => `
  <url>
    <loc>${siteUrl}/article/${article.slug}</loc>
    <lastmod>${article.updated_at?.split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}