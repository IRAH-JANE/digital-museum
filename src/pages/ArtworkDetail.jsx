import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronUp, Columns2, Shuffle } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { ZoomViewer } from '../components/artwork/ZoomViewer'
import { FavoriteButton } from '../components/artwork/FavoriteButton'
import { RelatedWorks } from '../components/artwork/RelatedWorks'
import { EmptyState } from '../components/ui/EmptyState'
import { artworks, getArtwork } from '../data/artworks'
import { getArtist } from '../data/artists'
import { getRoom } from '../data/rooms'
import { periodName } from '../data/periods'
import { randomArtwork } from '../utils/recommendations'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useIsMobile } from '../hooks/useMediaQuery'
import { useMuseum } from '../context/MuseumProvider'

function Field({ label, children }) {
  if (!children) return null
  return (
    <div className="border-t border-[var(--rule)] py-3">
      <dt className="plaque text-[var(--ink-faint)]">{label}</dt>
      <dd className="mt-1.5 text-sm text-[var(--ink-soft)]">{children}</dd>
    </div>
  )
}

function Prose({ title, body, note }) {
  return (
    <section className="border-t border-[var(--rule)] pt-6">
      <h2 className="plaque text-[var(--gold)]">{title}</h2>
      {note ? <p className="mt-1 text-xs text-[var(--ink-faint)]">{note}</p> : null}
      <p className="mt-4 max-w-reading text-sm leading-[1.85] text-[var(--ink-soft)]">{body}</p>
    </section>
  )
}

export default function ArtworkDetail() {
  const { artworkId } = useParams()
  const navigate = useNavigate()
  const artwork = getArtwork(artworkId)
  const isMobile = useIsMobile()
  const { visitArtwork, compare, toggleCompare } = useMuseum()
  const [immersive, setImmersive] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const detailsRef = useRef(null)

  const index = artworks.findIndex((item) => item.id === artworkId)
  const previous = index > 0 ? artworks[index - 1] : artworks[artworks.length - 1]
  const next = index >= 0 && index < artworks.length - 1 ? artworks[index + 1] : artworks[0]

  const artist = artwork ? getArtist(artwork.artistId) : null
  const room = artwork ? getRoom(artwork.roomId) : null
  const inCompare = artwork ? compare.includes(artwork.id) : false

  useEffect(() => {
    if (artwork) visitArtwork(artwork)
  }, [artwork, visitArtwork])

  useEffect(() => {
    setSheetOpen(false)
  }, [artworkId])

  const shortcuts = useMemo(
    () => ({
      n: () => navigate(`/artwork/${next.id}`),
      p: () => navigate(`/artwork/${previous.id}`),
    }),
    [navigate, next, previous],
  )
  useKeyboardShortcuts(shortcuts)

  /* Swipe between works on touch screens, but only from the page, not the
     image itself — the viewer keeps horizontal drags for panning. */
  const touch = useRef(null)
  const onTouchStart = useCallback((event) => {
    const point = event.touches[0]
    touch.current = { x: point.clientX, y: point.clientY }
  }, [])
  const onTouchEnd = useCallback(
    (event) => {
      if (!touch.current) return
      const point = event.changedTouches[0]
      const dx = point.clientX - touch.current.x
      const dy = point.clientY - touch.current.y
      touch.current = null
      if (Math.abs(dx) < 70 || Math.abs(dy) > 60) return
      navigate(`/artwork/${dx < 0 ? next.id : previous.id}`)
    },
    [navigate, next, previous],
  )

  if (!artwork) {
    return (
      <EmptyState
        title="Something went wrong while opening this artwork."
        body="That catalogue number is not in the collection. It may have been removed, or the link may be mistyped."
        actionLabel="Return to gallery"
        actionTo="/artworks"
      />
    )
  }

  return (
    <PageTransition kind="reveal">
      <div
        className={immersive ? 'pb-0' : 'pb-36 lg:pb-4'}
        onTouchStart={isMobile ? onTouchStart : undefined}
        onTouchEnd={isMobile ? onTouchEnd : undefined}
      >
        {/* ------------------------------------------------------------ breadcrumb */}
        {!immersive ? (
          <div className="mx-auto flex max-w-[110rem] flex-wrap items-center gap-x-3 gap-y-2 px-5 pt-7 text-xs text-[var(--ink-faint)] sm:px-10">
            <Link to="/artworks" className="link-underline uppercase tracking-plaque">
              Collection
            </Link>
            <span aria-hidden="true">/</span>
            {room ? (
              <>
                <Link to={`/rooms/${room.id}`} className="link-underline uppercase tracking-plaque">
                  Room {room.number} · {room.name}
                </Link>
                <span aria-hidden="true">/</span>
              </>
            ) : null}
            <span className="uppercase tracking-plaque">{artwork.title}</span>
          </div>
        ) : null}

        {/* ---------------------------------------------------------------- viewer */}
        <div className="mx-auto mt-6 max-w-[110rem] px-0 sm:px-10">
          <ZoomViewer artwork={artwork} onFullscreenChange={setImmersive} />
        </div>

        {/* ------------------------------------------------------- label + details */}
        <div
          ref={detailsRef}
          className="mx-auto grid max-w-[110rem] gap-12 px-5 pb-20 pt-12 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16"
        >
          <div>
            <p className="plaque text-[var(--gold)]">{periodName(artwork.period)}</p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,4rem)] font-light italic leading-[1.05]">
              {artwork.title}
            </h1>
            <p className="mt-4 text-base text-[var(--ink-soft)]">
              {artist ? (
                <Link to={`/artists/${artist.id}`} className="link-underline">
                  {artwork.artist}
                </Link>
              ) : (
                artwork.artist
              )}
              <span className="text-[var(--ink-faint)]"> · {artwork.yearText}</span>
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <FavoriteButton artwork={artwork} withLabel className="px-4 py-2.5" />
              <button
                type="button"
                onClick={() => toggleCompare(artwork.id)}
                aria-pressed={inCompare}
                className={`btn ${inCompare ? 'border-[var(--gold)] text-[var(--gold)]' : ''}`}
              >
                <Columns2 size={15} strokeWidth={1.5} />
                {inCompare ? 'In comparison' : 'Compare'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/artwork/${randomArtwork(artwork.id).id}`)}
                className="btn btn-quiet"
              >
                <Shuffle size={15} strokeWidth={1.5} />
                Something else
              </button>
            </div>

            <div className="mt-12 space-y-10">
              <Prose title="About the artwork" body={artwork.description} />
              {artist ? (
                <section className="border-t border-[var(--rule)] pt-6">
                  <h2 className="plaque text-[var(--gold)]">About the artist</h2>
                  <p className="mt-4 max-w-reading text-sm leading-[1.85] text-[var(--ink-soft)]">
                    {artist.bio}
                  </p>
                  <Link
                    to={`/artists/${artist.id}`}
                    className="link-underline mt-4 inline-block text-xs uppercase tracking-plaque text-[var(--ink-soft)]"
                  >
                    {artist.name}
                    {artist.birth ? ` · ${artist.birth}${artist.death ? `–${artist.death}` : ''}` : ''}
                  </Link>
                </section>
              ) : null}
              <Prose title="Historical context" body={artwork.historicalContext} />
              <Prose
                title="Curator's note"
                note="An interpretation, not a fact about the work."
                body={artwork.curatorNote}
              />
            </div>
          </div>

          {/* ------------------------------------------------------------ the plaque */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-[var(--rule)] p-6">
              <p className="plaque text-[var(--ink-faint)]">Museum label</p>
              <dl className="mt-4">
                <Field label="Artist">{artwork.artist}</Field>
                <Field label="Year">{artwork.yearText}</Field>
                <Field label="Medium">{artwork.materials}</Field>
                <Field label="Category">{artwork.category}</Field>
                <Field label="Dimensions">{artwork.dimensions}</Field>
                <Field label="Location">{artwork.location}</Field>
                <Field label="Historical period">{periodName(artwork.period)}</Field>
                <Field label="Region">{artwork.region}</Field>
                <Field label="Room">
                  {room ? (
                    <Link to={`/rooms/${room.id}`} className="link-underline">
                      {room.number} · {room.name}
                    </Link>
                  ) : null}
                </Field>
              </dl>

              {artwork.tags?.length ? (
                <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--rule)] pt-5">
                  {artwork.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[var(--rule)] px-2 py-1 text-[0.65rem] uppercase tracking-plaque text-[var(--ink-faint)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <p className="mt-6 border-t border-[var(--rule)] pt-5 text-[0.68rem] leading-relaxed text-[var(--ink-faint)]">
                {artwork.generated
                  ? 'Generated in your browser for this project. Not a historical object.'
                  : 'Public-domain work. Photograph served from Wikimedia Commons.'}
              </p>
            </div>

            <p className="mt-4 hidden text-[0.68rem] leading-relaxed text-[var(--ink-faint)] lg:block">
              Keyboard: N for the next work, P for the previous, F for fullscreen inside the viewer.
            </p>
          </aside>
        </div>

        {/* --------------------------------------------------------------- related */}
        <div className="mx-auto max-w-[110rem] px-5 pb-16 sm:px-10">
          <RelatedWorks artworkId={artwork.id} />

          <nav className="mt-16 flex items-center justify-between gap-6 border-t border-[var(--rule)] pt-8">
            <Link to={`/artwork/${previous.id}`} className="group flex min-w-0 items-center gap-3">
              <ArrowLeft
                size={16}
                strokeWidth={1.5}
                className="shrink-0 text-[var(--ink-faint)] transition-transform duration-500 ease-gallery group-hover:-translate-x-1"
              />
              <span className="min-w-0">
                <span className="plaque block text-[var(--ink-faint)]">Previous</span>
                <span className="block truncate font-display text-lg italic">{previous.title}</span>
              </span>
            </Link>
            <Link to={`/artwork/${next.id}`} className="group flex min-w-0 items-center gap-3 text-right">
              <span className="min-w-0 order-1">
                <span className="plaque block text-[var(--ink-faint)]">Next</span>
                <span className="block truncate font-display text-lg italic">{next.title}</span>
              </span>
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="order-2 shrink-0 text-[var(--ink-faint)] transition-transform duration-500 ease-gallery group-hover:translate-x-1"
              />
            </Link>
          </nav>
        </div>

        {/* ------------------------------------------- mobile information sheet */}
        {isMobile && !immersive ? (
          <div className="fixed inset-x-0 bottom-16 z-40 border-t border-[var(--rule)] bg-[var(--paper)]/95 backdrop-blur-md lg:hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base italic leading-tight">{artwork.title}</p>
                <p className="truncate text-xs text-[var(--ink-faint)]">
                  {artwork.artist} · {artwork.yearText}
                </p>
              </div>
              <FavoriteButton artwork={artwork} size={16} />
              <button
                type="button"
                onClick={() => setSheetOpen((open) => !open)}
                aria-expanded={sheetOpen}
                aria-label={sheetOpen ? 'Hide the label' : 'Show the label'}
                className="border border-[var(--rule)] p-2 text-[var(--ink-soft)]"
              >
                <motion.span animate={{ rotate: sheetOpen ? 180 : 0 }} className="flex">
                  <ChevronUp size={16} strokeWidth={1.5} />
                </motion.span>
              </button>
            </div>
            <AnimatePresence initial={false}>
              {sheetOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <dl className="max-h-[42vh] overflow-y-auto px-4 pb-4">
                    <Field label="Medium">{artwork.materials}</Field>
                    <Field label="Dimensions">{artwork.dimensions}</Field>
                    <Field label="Location">{artwork.location}</Field>
                    <Field label="Period">{periodName(artwork.period)}</Field>
                  </dl>
                  <div className="px-4 pb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSheetOpen(false)
                        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className="btn w-full justify-center"
                    >
                      Read the full entry
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <p className="px-4 pb-2 text-center text-[0.62rem] text-[var(--ink-faint)]">
              Swipe left or right for the next work
            </p>
          </div>
        ) : null}
      </div>
    </PageTransition>
  )
}
