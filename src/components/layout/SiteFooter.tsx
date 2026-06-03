'use client'

import Link from 'next/link'
import { Twitter, Facebook, Instagram, Linkedin, Mail, Rss } from 'lucide-react'
import { NewsletterForm } from '@/components/shared/NewsletterForm'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Chronicle'

const FOOTER_LINKS = {
  sections: [
    { label: 'News', href: '/category/news' },
    { label: 'Features', href: '/category/features' },
    { label: 'Opinion', href: '/category/opinion' },
    { label: 'Politics', href: '/category/politics' },
    { label: 'Business', href: '/category/business' },
  ],
  media: [
    { label: 'Technology', href: '/category/technology' },
    { label: 'Sports', href: '/category/sports' },
    { label: 'Lifestyle', href: '/category/lifestyle' },
    { label: 'Church', href: '/category/church' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'RSS Feed', href: '/api/rss' },
  ],
}

export function SiteFooter() {
  return (
    <footer className="bg-ink-950 text-ink-300 mt-16">

      {/* Newsletter section */}
      <div className="border-b border-ink-800 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl text-white font-bold">Stay Informed</h3>
            <p className="text-ink-400 mt-1 text-sm">Get the day's top stories delivered to your inbox.</p>
          </div>
          <div className="w-full md:w-80">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/">
              <h2 className="font-serif text-3xl font-bold text-white">{siteName}</h2>
            </Link>
            <p className="mt-3 text-sm text-ink-400 leading-relaxed max-w-xs">
              Independent journalism committed to truth, accountability, and the stories that matter to our community.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Twitter, href: '#', label: 'X/Twitter' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Mail, href: '/contact', label: 'Email' },
                { icon: Rss, href: '/api/rss', label: 'RSS' },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2 rounded-lg bg-ink-900 text-ink-400 hover:text-white hover:bg-ink-800 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-ink-500 mb-4">Sections</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.sections.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-ink-500 mb-4">More</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.media.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-ink-500 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-900 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-ink-600">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p>Built with Next.js &amp; Supabase</p>
        </div>
      </div>

    </footer>
  )
}