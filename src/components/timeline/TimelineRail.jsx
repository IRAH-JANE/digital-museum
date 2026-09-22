import { Reveal } from '../ui/Reveal'
import { cn } from '../../utils/cn'

/**
 * A vertical rail used for artist lives and exhibition histories. Entries fade
 * in as they arrive, which is the one place a scroll animation earns its place.
 */
export function TimelineRail({ entries, className, compact = false }) {
  if (!entries?.length) return null
  return (
    <ol className={cn('relative border-l border-[var(--rule)] pl-6', className)}>
      {entries.map((entry, index) => (
        <li key={`${entry.year}-${index}`} className={cn('relative', compact ? 'pb-5' : 'pb-8')}>
          <span
            aria-hidden="true"
            className="absolute -left-[1.6rem] top-2 h-1.5 w-1.5 rounded-full bg-[var(--gold)]"
          />
          <Reveal delay={index * 0.05} y={10}>
            <p className="font-display text-xl tabular-nums leading-none">
              {entry.year < 0 ? `${Math.abs(entry.year)} BCE` : entry.year}
            </p>
            <p className="mt-1.5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">{entry.label}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
