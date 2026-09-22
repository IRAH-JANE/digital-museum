import { periodName } from '../../data/periods'
import { cn } from '../../utils/cn'

/** The wall label: name, dates, materials — set the way a museum sets them. */
export function ArtworkLabel({ artwork, className, extended = false }) {
  return (
    <div className={cn('max-w-[28ch] text-left', className)}>
      <p className="text-[0.8rem] leading-snug text-[var(--ink-soft)]">{artwork.artist}</p>
      <p className="font-display text-lg italic leading-snug">{artwork.title}</p>
      <p className="mt-0.5 text-xs text-[var(--ink-faint)]">{artwork.yearText}</p>
      <p className="mt-1 text-xs leading-snug text-[var(--ink-faint)]">{artwork.materials}</p>
      {extended ? (
        <p className="mt-2 text-xs leading-snug text-[var(--ink-faint)]">
          {periodName(artwork.period)} · {artwork.dimensions}
        </p>
      ) : null}
    </div>
  )
}
