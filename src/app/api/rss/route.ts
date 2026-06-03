import { getPublishedArticles } from '@/lib/articles'
import { getSiteUrl } from '@/lib/utils'

export async function GET() {
  const siteUrl = getSiteUrl()
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Chronicle'
  const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Breaking news and in-depth features'

  const { data: articles } = await getPublishedArticles(1, 20)

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>${siteDescription}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml"/>
    ${articles.map((article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/article/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/article/${article.slug}</guid>
      <description><![CDATA[${article.excerpt || article.subtitle || ''}]]></description>
      <pubDate>${article.published_at ? new Date(article.published_at).toUTCString() : ''}</pubDate>
      ${article.author ? `<author>${article.author.full_name}</author>` : ''}
      ${article.category ? `<category>${article.category.name}</category>` : ''}
    </item>`).join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
