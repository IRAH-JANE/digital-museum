import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMuseum } from '../../context/MuseumProvider'

const steps = [
  { title: 'Welcome to Digital Museum.', body: 'Nine rooms, forty-six works, and no queue at the cloakroom.' },
  { title: 'Explore rooms filled with art and history.', body: 'Each room has its own wall colour, its own light and its own period.' },
  { title: 'Build your own collection.', body: 'Save anything that stops you. It stays on this device — there is no account.' },
  { title: 'Take your time.', body: 'Nothing here expires, and nothing is trying to hold your attention.' },
]

/** Four cards on a first visit. Skippable, and never shown again once done. */
export function Onboarding({ onFinish }) {
  const { setOnboarded } = useMuseum()
  const [index, setIndex] = useState(0)
  const step = steps[index]
  const isLast = index === steps.length - 1

  const finish = () => {
    setOnboarded(true)
    onFinish?.()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--wall)] px-6">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="plaque mb-6">
              {String(index + 1).padStart(2, '0')} of {String(steps.length).padStart(2, '0')}
            </p>
            <h2 className="font-display text-4xl font-light leading-tight sm:text-5xl">{step.title}</h2>
            <p className="mt-4 max-w-reading text-base leading-relaxed text-[var(--ink-soft)]">{step.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between gap-4">
          <button type="button" onClick={finish} className="btn btn-quiet px-0 text-[var(--ink-faint)]">
            Skip
          </button>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden="true">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-px w-6 transition-colors duration-500 ${
                    i <= index ? 'bg-[var(--gold)]' : 'bg-[var(--rule)]'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              className="btn"
              onClick={() => (isLast ? finish() : setIndex((i) => i + 1))}
            >
              {isLast ? 'Enter museum' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
