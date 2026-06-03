import Link from 'next/link'
import { type ReactNode } from 'react'

interface Props {
  title: string
  href?: string
  icon?: ReactNode
}

export function SectionHeader({ title, href, icon }: Props) {
  return (
    <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-ink-900 dark:border-ink-100">
      <h2 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {href && href !== '#' && (
        <Link href={href} className="text-xs font-semibold uppercase tracking-wider text-accent hover:text-accent-700 transition-colors">
          See All →
        </Link>
      )}
    </div>
  )
}
