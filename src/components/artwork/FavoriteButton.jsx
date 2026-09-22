import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useMuseum } from '../../context/MuseumProvider'
import { cn } from '../../utils/cn'

export function FavoriteButton({ artwork, size = 18, className, withLabel = false }) {
  const { favorites } = useMuseum()
  const saved = favorites.has(artwork.id)

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        favorites.toggleWithToast(artwork)
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${artwork.title} from your collection` : `Save ${artwork.title} to your collection`}
      className={cn(
        'group/fav inline-flex items-center gap-2 border border-[var(--rule)] bg-[var(--paper)]/85 px-2.5 py-2 backdrop-blur-sm transition-colors duration-300',
        saved ? 'text-[var(--gold)]' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]',
        className,
      )}
    >
      <motion.span
        key={saved ? 'on' : 'off'}
        initial={{ scale: 0.7 }}
        animate={{ scale: [0.7, 1.25, 1] }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex"
      >
        <Heart size={size} strokeWidth={1.25} fill={saved ? 'currentColor' : 'none'} />
      </motion.span>
      {withLabel ? (
        <span className="text-xs uppercase tracking-plaque">{saved ? 'Saved' : 'Save'}</span>
      ) : null}
    </button>
  )
}
