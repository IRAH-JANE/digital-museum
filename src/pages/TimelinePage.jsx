import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/layout/PageTransition'
import { ArtworkFrame } from '../components/artwork/ArtworkFrame'
import { TimelineRail } from '../components/timeline/TimelineRail'
import { SectionHeading } from '../components/ui/SectionHeading'
import { periods } from '../data/periods'
import { artworksByPeriod } from '../data/artworks'
import { artistsById } from '../data/artists'
import { rooms } from '../data/rooms'
import { cn } from '../utils/cn'

export default function TimelinePage() {
  const [activeId, setActiveId] = useState('renaissance')
  const active = periods.find((period) => period.id === activeId) ?? periods[0]

  const works = useMemo(() => artworksByPeriod(active.id), [active])
  const artists = useMemo(() => {
    const ids = [...new Set(works.map((work) => work.artistId))]
    return ids.map((id) => artistsById[id]).filter(Boolean)
  }, [works])
  const relatedRooms = useMemo(
    () => rooms.filter((room) => room.periodId === active.id),
    [active],
  )

  return (
    <PageTransition>
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10 lg:py-16">
          <p className="plaque text-[var(--gold)]">Art history</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none">
            Timeline
          </h1>
          <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
            Eight periods, laid end to end. The boundaries are conventions rather than facts —
            movements overlap, and a painter can sit on both sides of a line. Choose one to see what
            the museum holds from it.
          </p>
        </div>
      </header>

      {/* ------------------------------------------------------------- the axis */}
      <div className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] overflow-x-auto px-5 py-10 sm:px-10">
          <ol className="flex min-w-max items-end gap-0">
            {periods.map((period) => {
              const isActive = period.id === active.id
              const count = artworksByPeriod(period.id).length
              return (
                <li key={period.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveId(period.id)}
                    aria-pressed={isActive}
                    className={cn(
                      'group relative block w-40 border-l border-[var(--rule)] px-4 pb-3 pt-2 text-left transition-colors duration-500 sm:w-52',
                      isActive ? 'text-[var(--ink)]' : 'text-[var(--ink-faint)] hover:text-[var(--ink-soft)]',
                    )}
                  >
                    <span className="block text-xs tabular-nums tracking-plaque">
                      {period.axisLabel}
                    </span>
                    <span className="mt-2 block font-display text-xl font-light leading-tight">
                      {period.name}
                    </span>
                    <span className="mt-1 block text-[0.68rem]">
                      {count} {count === 1 ? 'work' : 'works'}
                    </span>
                    {isActive ? (
                      <motion.span
                        layoutId="timeline-marker"
                        className="absolute -bottom-px left-0 h-0.5 w-full bg-[var(--gold)]"
                      />
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <div className="mx-auto max-w-[110rem] px-5 py-14 sm:px-10">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid gap-10 border-b border-[var(--rule)] pb-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <p className="plaque text-[var(--ink-faint)]">
                {active.start < 0 ? `${Math.abs(active.start)} BCE` : active.start} — {active.end}
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.6rem)] font-light uppercase leading-none">
                {active.name}
              </h2>
              <p className="mt-6 max-w-reading text-sm leading-[1.85] text-[var(--ink-soft)]">
                {active.summary}
              </p>

              {relatedRooms.length ? (
                <div className="mt-8">
                  <p className="plaque text-[var(--ink-faint)]">Related rooms</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {relatedRooms.map((room) => (
                      <li key={room.id}>
                        <Link
                          to={`/rooms/${room.id}`}
                          className="border border-[var(--rule)] px-3 py-1.5 text-xs uppercase tracking-plaque text-[var(--ink-soft)] transition-colors duration-300 hover:border-[var(--ink)] hover:text-[var(--ink)]"
                        >
                          {room.number} · {room.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div>
              <p className="plaque text-[var(--ink-faint)]">Historical events</p>
              <div className="mt-5">
                <TimelineRail entries={active.events} compact />
              </div>
            </div>
          </div>

          <section className="mt-14">
            <SectionHeading
              title="Major works"
              note={
                works.length
                  ? `${works.length} in the collection.`
                  : 'Nothing from this period is currently on display.'
              }
              to="/artworks"
              linkLabel="Whole collection"
            />
            {works.length ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-10 lg:grid-cols-4">
                {works.slice(0, 8).map((work) => (
                  <ArtworkFrame key={work.id} artwork={work} height="h-44 sm:h-52" />
                ))}
              </div>
            ) : null}
          </section>

          {artists.length ? (
            <section className="mt-16">
              <SectionHeading title="Artists of the period" to="/artists" linkLabel="All artists" />
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {artists.map((artist) => (
                  <li key={artist.id}>
                    <Link
                      to={`/artists/${artist.id}`}
                      className="flex items-baseline justify-between gap-4 border-b border-[var(--rule)] py-3"
                    >
                      <span className="font-display text-lg">{artist.name}</span>
                      <span className="shrink-0 text-xs text-[var(--ink-faint)]">
                        {artist.movement}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </motion.div>
      </div>
    </PageTransition>
  )
}
