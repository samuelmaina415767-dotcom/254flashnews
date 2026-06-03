'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Search, Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/category/news', label: 'News' },
  { href: '/category/features', label: 'Features' },
  { href: '/category/opinion', label: 'Opinion' },
  { href: '/category/politics', label: 'Politics' },
  { href: '/category/business', label: 'Business' },
  { href: '/category/technology', label: 'Technology' },
  { href: '/category/sports', label: 'Sports' },
  { href: '/category/lifestyle', label: 'Lifestyle' },
  { href: '/category/church', label: 'Church' },
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Chronicle'

  return (
    <header className="sticky top-0 z-50 bg-ink-50/95 dark:bg-ink-950/95 backdrop-blur-sm border-b border-ink-200 dark:border-ink-800">
      {/* Top bar */}
      <div className="border-b border-ink-200 dark:border-ink-800 py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-ink-500">
          <time>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</time>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-ink-900 dark:hover:text-ink-100 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-ink-900 dark:hover:text-ink-100 transition-colors">Contact</Link>
            <Link href="/admin" className="hover:text-accent transition-colors">Admin</Link>
          </div>
        </div>
      </div>

      {/* Logo row */}
      <div className="py-4 px-4 border-b border-ink-200 dark:border-ink-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="group">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink-950 dark:text-ink-50 tracking-tight leading-none">
              {siteName.split(' ').map((word, i) => (
                <span key={i} className={i === 0 ? 'text-accent' : ''}>{word}{' '}</span>
              ))}
            </h1>
            <p className="text-xs text-ink-400 dark:text-ink-600 tracking-[0.2em] uppercase mt-0.5 font-sans">
              Independent · Fearless · Informed
            </p>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/search" className="btn-ghost p-2">
              <Search className="w-5 h-5" />
              <span className="sr-only">Search</span>
            </Link>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn-ghost p-2"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5 dark:hidden" />
              <Moon className="w-5 h-5 hidden dark:block" />
            </button>
            <button
              className="btn-ghost p-2 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:block px-4">
        <div className="max-w-7xl mx-auto">
          <ul className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            <li>
              <Link
                href="/"
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap block',
                  pathname === '/'
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-ink-700 dark:text-ink-300 hover:text-accent'
                )}
              >
                Home
              </Link>
            </li>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap block',
                    pathname === href
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-ink-700 dark:text-ink-300 hover:text-accent'
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-950">
          <nav className="px-4 py-4">
            <ul className="space-y-1">
              <li>
                <Link href="/" className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
              </li>
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
