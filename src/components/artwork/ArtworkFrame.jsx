import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SmartImage } from './SmartImage'
import { FavoriteButton } from './FavoriteButton'
import { useMuseumSettings } from '../../context/MuseumProvider'
import { cn } from '../../utils/cn'

/**
 * A work as it hangs on the wall: mat, frame, shadow, and a label underneath.
 * Hovering lifts the frame very slightly and brings the label up — the only
 * hover motion in the museum, because it stands in for stepping closer.
 */
export function ArtworkFrame({ artwork, height = 'h-64', eager = false, showLabel = true, className }) {
  const { motionEnabled, settings } = useMuseumSettings()
  const labelsOn = settings.showLabels && showLabel

  return (
    <motion.article
      className={cn('group relative flex flex-col items-center', className)}
      whileHover={motionEnabled ? { y: -4 } : undefined}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/artwork/${artwork.id}`}
        className="block w-full focus-visible:outline-offset-8"
        aria-label={`${artwork.title} by ${artwork.artist}, ${artwork.yearText}`}
      >
        {/* The hanging wire, drawn rather than imagined */}
        <span
          aria-hidden="true"
          className="mx-auto mb-1 block h-4 w-px bg-[var(--rule)] opacity-70"
        />
        <div className="frame-mount relative p-2 transition-shadow duration-700 ease-gallery group-hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.6)] sm:p-3">
          <div className="border border-[var(--frame)]/25 p-1.5 sm:p-2">
            <SmartImage
              src={artwork.thumb}
              seed={artwork.id}
              alt={`${artwork.title} by ${artwork.artist}`}
              eager={eager}
              className={cn('w-full', height)}
              imgClassName={cn(
                'transition-transform duration-[1200ms] ease-gallery',
                motionEnabled ? 'group-hover:scale-[1.035]' : '',
              )}
            />
          </div>
        </div>
      </Link>

      <FavoriteButton
        artwork={artwork}
        className="absolute right-3 top-6 opacity-0 transition-opacity duration-500 focus-visible:opacity-100 group-hover:opacity-100 sm:right-4"
      />

      {labelsOn ? (
        <div className="mt-4 w-full max-w-[26ch] text-center transition-transform duration-700 ease-gallery group-hover:-translate-y-0.5">
          <p className="font-display text-base italic leading-snug">{artwork.title}</p>
          <p className="mt-0.5 text-xs text-[var(--ink-soft)]">{artwork.artist}</p>
          <p className="text-xs text-[var(--ink-faint)]">
            {artwork.yearText} · {artwork.materials}
          </p>
        </div>
      ) : null}
    </motion.article>
  )
}
