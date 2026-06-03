'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, FolderOpen, Tag, Image as ImageIcon,
  Users, BarChart3, Settings, Home, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/tags', label: 'Tags', icon: Tag },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
  { href: '/admin/authors', label: 'Authors', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Chronicle'

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      'hidden md:flex flex-col border-r border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-950 transition-all duration-300 shrink-0',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className={cn('px-4 py-5 border-b border-ink-200 dark:border-ink-800 flex items-center', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && (
          <Link href="/admin" className="font-serif font-bold text-ink-900 dark:text-ink-100 text-lg leading-tight">
            <span className="text-accent">{siteName.split(' ')[0]}</span>
            {siteName.split(' ').slice(1).join(' ') && ` ${siteName.split(' ').slice(1).join(' ')}`}
            <span className="block text-[10px] font-sans font-normal text-ink-400 uppercase tracking-widest">Admin</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-ink-500 hover:text-ink-900 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn('admin-nav-item', active && 'active', collapsed && 'justify-center px-2')}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-ink-200 dark:border-ink-800 space-y-0.5">
        <Link
          href="/"
          title={collapsed ? 'View Site' : undefined}
          className={cn('admin-nav-item', collapsed && 'justify-center px-2')}
        >
          <Home className="w-4 h-4 shrink-0" />
          {!collapsed && <span>View Site</span>}
        </Link>
      </div>
    </aside>
  )
}
