import { AnimatePresence, motion } from 'framer-motion'
import { Award, X } from 'lucide-react'
import { useMuseum } from '../../context/MuseumProvider'

export function Toasts() {
  const { toasts, dismissToast } = useMuseum()

  return (
    <div
      className="pointer-events-none fixed bottom-[calc(72px+env(safe-area-inset-bottom,0px))] left-1/2 z-[95] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2 md:bottom-8 md:left-auto md:right-8 md:translate-x-0"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex items-start gap-3 border border-[var(--rule)] bg-[var(--paper)] px-4 py-3 shadow-xl"
          >
            {toast.kind === 'achievement' ? (
              <Award size={16} strokeWidth={1.25} className="mt-0.5 shrink-0 text-[var(--gold)]" />
            ) : null}
            <div className="min-w-0 flex-1">
              {toast.kind === 'achievement' ? (
                <p className="plaque mb-0.5">Achievement</p>
              ) : null}
              <p className="truncate font-display text-lg leading-snug">{toast.title}</p>
              {toast.body ? (
                <p className="truncate text-xs text-[var(--ink-soft)]">{toast.body}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="-mr-1 -mt-1 p-1 text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
              aria-label="Dismiss"
            >
              <X size={14} strokeWidth={1.25} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
