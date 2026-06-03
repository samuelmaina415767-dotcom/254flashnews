import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { BreakingNewsTicker } from '@/components/layout/BreakingNewsTicker'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const breakingNews: any[] = []

  return (
    <div className="min-h-screen flex flex-col">
      {breakingNews.length > 0 && <BreakingNewsTicker items={breakingNews} />}
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}