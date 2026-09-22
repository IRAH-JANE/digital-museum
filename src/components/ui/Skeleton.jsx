import { cn } from '../../utils/cn'

export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} aria-hidden="true" />
}

export function GalleryLoading({ label = 'Preparing the gallery' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <span className="block h-px w-16 origin-left animate-pulse bg-[var(--gold)]" />
      <p className="font-display text-2xl italic text-[var(--ink-soft)]">{label}…</p>
    </div>
  )
}
