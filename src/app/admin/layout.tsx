export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      {children}
    </div>
  )
}