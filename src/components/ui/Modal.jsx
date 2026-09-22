import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * A dialog that traps focus, closes on Escape, restores focus on exit and
 * locks the page behind it.
 */
export function Modal({ open, onClose, title, children, className, labelledBy }) {
  const panelRef = useRef(null)
  const returnFocus = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    returnFocus.current = document.activeElement
    document.body.classList.add('no-scroll')

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    const id = setTimeout(() => {
      const target = panelRef.current?.querySelector('[data-autofocus]') ?? panelRef.current
      target?.focus?.()
    }, 40)

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.classList.remove('no-scroll')
      clearTimeout(id)
      returnFocus.current?.focus?.()
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button
            type="button"
            aria-label="Close"
            className="fixed inset-0 h-full w-full cursor-default bg-black/55 backdrop-blur-[2px]"
            onClick={onClose}
            tabIndex={-1}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={labelledBy ? undefined : title}
            aria-labelledby={labelledBy}
            tabIndex={-1}
            className={cn(
              'relative z-10 my-auto w-full max-w-2xl border border-[var(--rule)] bg-[var(--paper)] p-6 shadow-2xl outline-none sm:p-9',
              className,
            )}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {title ? (
              <div className="mb-6 flex items-start justify-between gap-6">
                <h2 className="font-display text-2xl font-light">{title}</h2>
                <button type="button" onClick={onClose} className="btn btn-quiet -mr-2" aria-label="Close dialog">
                  <X size={16} strokeWidth={1.25} />
                </button>
              </div>
            ) : null}
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
