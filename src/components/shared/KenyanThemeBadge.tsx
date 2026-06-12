import { cn } from '@/lib/utils'

export function KenyanThemeBadge({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex flex-col w-6 h-4 rounded-sm overflow-hidden border border-ink-200 dark:border-ink-700 shrink-0">
        <div className="flex-1 bg-black" />
        <div className="flex-1 bg-[#bb0000]" />
        <div className="flex-1 bg-[#006600]" />
      </div>
      <span className="text-xs font-semibold text-ink-600 dark:text-ink-400">Kenya</span>
    </div>
  )
}

export function KenyanFlagStrip() {
  return (
    <div className="flex h-1 w-full">
      <div className="flex-1 bg-black" />
      <div className="flex-1 bg-[#bb0000]" />
      <div className="flex-1 bg-white dark:bg-ink-200" />
      <div className="flex-1 bg-[#006600]" />
    </div>
  )
}

export function KenyaBadge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-ink-900 dark:bg-ink-800 rounded-full">
      <div className="flex gap-0.5">
        <div className="w-1.5 h-3 bg-black rounded-sm" />
        <div className="w-1.5 h-3 bg-[#bb0000] rounded-sm" />
        <div className="w-1.5 h-3 bg-[#006600] rounded-sm" />
      </div>
      <span className="text-white text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
  )
}

