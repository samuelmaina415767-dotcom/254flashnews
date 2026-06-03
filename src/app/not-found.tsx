import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-serif text-8xl font-bold text-ink-200 dark:text-ink-800 mb-4">404</p>
        <h1 className="font-serif text-3xl font-bold text-ink-900 dark:text-ink-100 mb-3">
          Page Not Found
        </h1>
        <p className="text-ink-600 dark:text-ink-400 mb-8">
          The story you're looking for has been moved, deleted, or never existed.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary">← Back to Home</Link>
          <Link href="/search" className="btn-secondary">Search Stories</Link>
        </div>
      </div>
    </div>
  )
}
