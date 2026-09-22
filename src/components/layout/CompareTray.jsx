import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { artworksById } from '../../data/artworks'
import { useMuseum } from '../../context/MuseumProvider'

/** Appears once a work is marked for comparison, and says what happens next. */
export function CompareTray({ onOpen }) {
  const { compare, toggleCompare, clearCompare } = useMuseum()
  const items = compare.map((id) => artworksById[id]).filter(Boolean)

  return (
    <AnimatePresence>
      {items.length ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-[calc(72px+env(safe-area-inset-bottom,0px))] left-1/2 z-[60] w-[min(94vw,34rem)] -translate-x-1/2 border border-[var(--rule)] bg-[var(--paper)] px-4 py-3 shadow-xl lg:bottom-8"
        >
          <div className="flex items-center gap-3">
            <p className="plaque shrink-0">Compare</p>
            <ul className="flex min-w-0 flex-1 items-center gap-3">
              {items.map((item) => (
                <li key={item.id} className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate text-sm italic">{item.title}</span>
                  <button
                    type="button"
                    onClick={() => toggleCompare(item.id)}
                    className="shrink-0 text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
                    aria-label={`Remove ${item.title} from the comparison`}
                  >
                    <X size={13} strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>
            {items.length === 2 ? (
              <button type="button" className="btn shrink-0 px-3 py-1.5" onClick={onOpen}>
                Open
              </button>
            ) : (
              <span className="shrink-0 text-xs text-[var(--ink-faint)]">Pick one more</span>
            )}
            <button
              type="button"
              onClick={clearCompare}
              className="shrink-0 text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
              aria-label="Clear the comparison"
            >
              <X size={15} strokeWidth={1.25} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
