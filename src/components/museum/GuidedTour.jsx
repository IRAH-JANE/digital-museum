import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'
import { SmartImage } from '../artwork/SmartImage'
import { artworksById } from '../../data/artworks'
import { periodName } from '../../data/periods'
import { useMuseum } from '../../context/MuseumProvider'

const DWELL = 9000

/**
 * The tour advances on a timer, holds on a work for nine seconds, and hands
 * control back the moment anyone touches a button.
 */
export function GuidedTour({ tour }) {
  const navigate = useNavigate()
  const { visitArtwork, progress, settings, pushToast } = useMuseum()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(settings.settings.autoPlayTour)
  const [elapsed, setElapsed] = useState(0)
  const completed = useRef(false)

  const stops = tour.stops.filter((stop) => artworksById[stop.id])
  const stop = stops[index]
  const artwork = artworksById[stop.id]
  const isLast = index === stops.length - 1

  useEffect(() => {
    visitArtwork(artwork)
  }, [artwork, visitArtwork])

  const finish = useCallback(() => {
    if (!completed.current) {
      completed.current = true
      progress.recordTour()
      pushToast({ kind: 'plain', title: 'Tour finished', body: tour.name, duration: 3200 })
    }
    navigate('/museum')
  }, [navigate, progress, pushToast, tour.name])

  const next = useCallback(() => {
    setElapsed(0)
    if (isLast) {
      finish()
      return
    }
    setIndex((i) => i + 1)
  }, [isLast, finish])

  const previous = useCallback(() => {
    setElapsed(0)
    setIndex((i) => Math.max(0, i - 1))
  }, [])

  useEffect(() => {
    if (!playing) return undefined
    const started = Date.now()
    const tick = setInterval(() => setElapsed(Date.now() - started), 120)
    const timer = setTimeout(next, DWELL)
    return () => {
      clearInterval(tick)
      clearTimeout(timer)
    }
  }, [playing, index, next])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') next()
      if (event.key === 'ArrowLeft') previous()
      if (event.key === ' ') {
        event.preventDefault()
        setPlaying((p) => !p)
      }
      if (event.key === 'Escape') finish()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [next, previous, finish])

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-[var(--wall)]">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--rule)] px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] sm:px-8">
        <div>
          <p className="plaque">{tour.name}</p>
          <p className="text-xs tabular-nums text-[var(--ink-faint)]">
            {String(index + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')}
          </p>
        </div>
        <button type="button" onClick={finish} className="btn btn-quiet" aria-label="Leave the tour">
          <X size={16} strokeWidth={1.25} />
          <span className="hidden sm:inline">Exit tour</span>
        </button>
      </header>

      <div className="relative h-0.5 w-full bg-[var(--rule)]">
        <motion.div
          className="h-full bg-[var(--gold)]"
          animate={{ width: `${playing ? Math.min(100, (elapsed / DWELL) * 100) : 0}%` }}
          transition={{ duration: 0.15, ease: 'linear' }}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 sm:px-8 lg:flex-row lg:items-center lg:gap-14 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="frame-mount mx-auto w-full max-w-2xl shrink-0 p-3 lg:max-w-none lg:flex-1"
          >
            <SmartImage
              src={artwork.image}
              seed={artwork.id}
              alt={`${artwork.title} by ${artwork.artist}`}
              eager
              className="h-[38vh] w-full sm:h-[46vh] lg:h-[62vh]"
            />
          </motion.div>
        </AnimatePresence>

        <div className="mx-auto w-full max-w-md lg:w-[22rem] lg:shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${artwork.id}-text`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-sm text-[var(--ink-soft)]">{artwork.artist}</p>
              <h1 className="font-display text-3xl font-light italic leading-tight sm:text-4xl">{artwork.title}</h1>
              <p className="mt-1 text-xs text-[var(--ink-faint)]">
                {artwork.yearText} · {periodName(artwork.period)} · {artwork.materials}
              </p>
              <p className="mt-6 border-l border-[var(--gold)] pl-4 text-base leading-relaxed">{stop.note}</p>
              <Link to={`/artwork/${artwork.id}`} className="link-underline mt-6 inline-block text-xs uppercase tracking-plaque">
                Open the full entry
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <footer className="flex items-center justify-center gap-2 border-t border-[var(--rule)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <button type="button" className="btn btn-quiet" onClick={previous} disabled={index === 0}>
          <ChevronLeft size={16} strokeWidth={1.25} />
          <span className="hidden sm:inline">Previous</span>
        </button>
        <button type="button" className="btn" onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause size={15} strokeWidth={1.25} /> : <Play size={15} strokeWidth={1.25} />}
          {playing ? 'Pause' : 'Play'}
        </button>
        <button type="button" className="btn btn-quiet" onClick={next}>
          <span className="hidden sm:inline">{isLast ? 'Finish' : 'Next'}</span>
          <ChevronRight size={16} strokeWidth={1.25} />
        </button>
      </footer>
    </div>
  )
}
