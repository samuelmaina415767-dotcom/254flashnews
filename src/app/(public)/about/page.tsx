import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Twitter, Linkedin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About our media brand — our mission, values, and the team behind the stories.',
}

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'The Chronicle'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <header className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">About</span>
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink-950 dark:text-ink-50 mb-4">
          {siteName}
        </h1>
        <p className="text-xl text-ink-600 dark:text-ink-400 font-serif italic max-w-2xl mx-auto">
          Independent journalism committed to truth, accountability, and the stories that shape our world.
        </p>
      </header>

      {/* Mission */}
      <section className="mb-14">
        <div className="border-l-4 border-accent pl-6 mb-8">
          <h2 className="font-serif text-3xl font-bold text-ink-900 dark:text-ink-100 mb-4">Our Mission</h2>
          <p className="text-lg text-ink-700 dark:text-ink-300 leading-relaxed">
            We believe in the power of journalism to hold power accountable, amplify underheard voices, and equip citizens with the information they need to participate fully in society.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Independent', desc: 'No corporate overlords. No advertisers calling the shots. Our editorial decisions are ours alone.' },
            { title: 'Fearless', desc: 'We report the stories that matter, even when they\'re uncomfortable, unpopular, or inconvenient.' },
            { title: 'Informed', desc: 'Every story is researched, verified, and written with the depth and nuance our readers deserve.' },
          ].map(({ title, desc }) => (
            <div key={title} className="p-5 bg-ink-50 dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800">
              <h3 className="font-serif font-bold text-lg text-accent mb-2">{title}</h3>
              <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About the author/editor */}
      <section className="mb-14">
        <h2 className="font-serif text-3xl font-bold text-ink-900 dark:text-ink-100 mb-8">The Team</h2>
        <div className="flex flex-col md:flex-row gap-8 p-8 bg-ink-50 dark:bg-ink-900 rounded-2xl border border-ink-200 dark:border-ink-800">
          <div className="shrink-0 flex justify-center md:block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-ink-200 to-ink-400 dark:from-ink-700 dark:to-ink-900 flex items-center justify-center text-5xl font-serif font-bold text-ink-600 dark:text-ink-400">
              E
            </div>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100">Editor-in-Chief</h3>
            <p className="text-accent text-sm font-semibold mt-0.5 mb-4">Founder & Publisher</p>
            <p className="text-ink-600 dark:text-ink-400 leading-relaxed mb-4">
              A seasoned journalist with over a decade of experience covering politics, business, and community affairs. Passionate about local accountability journalism and giving voice to underrepresented communities.
            </p>
            <div className="flex items-center gap-3">
              <a href="mailto:editor@yoursite.com" className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-accent transition-colors">
                <Mail className="w-4 h-4" /> Email
              </a>
              <a href="#" className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-accent transition-colors">
                <Twitter className="w-4 h-4" /> Twitter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center bg-accent/5 dark:bg-accent/10 rounded-2xl p-10 border border-accent/20">
        <h2 className="font-serif text-2xl font-bold text-ink-900 dark:text-ink-100 mb-3">
          Get in Touch
        </h2>
        <p className="text-ink-600 dark:text-ink-400 mb-6">
          Story tips, corrections, partnerships, or just to say hello.
        </p>
        <Link href="/contact" className="btn-primary">
          Contact Us
        </Link>
      </section>
    </div>
  )
}
