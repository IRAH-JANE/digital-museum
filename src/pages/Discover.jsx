import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Shuffle, Sparkles } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { SmartImage } from '../components/artwork/SmartImage'
import { ArtworkFrame } from '../components/artwork/ArtworkFrame'
import { SectionHeading } from '../components/ui/SectionHeading'
import { artworks, artworksById, artworksByArtist } from '../data/artworks'
import { artists } from '../data/artists'
import { rooms } from '../data/rooms'
import { exhibitions } from '../data/exhibitions'
import { periods, periodName } from '../data/periods'
import { pickForDay, formatDateLong } from '../utils/dateUtils'
import { hiddenGems, randomArtwork } from '../utils/recommendations'
import { useMuseum } from '../context/MuseumProvider'

/** "On this day": the first historical event whose month/day is closest to today. */
function eventForToday() {
  const all = periods.flatMap((period) =>
    period.events.map((event) => ({ ...event, period: period.id, periodName: period.name })),
  )
  const today = new Date()
  const index = (today.getMonth() * 31 + today.getDate()) % all.length
  return all[index]
}

export default function Discover() {
  const navigate = useNavigate()
  const { recent, settings } = useMuseum()
  const [shuffleKey, setShuffleKey] = useState(0)
  const [surprise, setSurprise] = useState(() => randomArtwork())

  const featured = useMemo(() => pickForDay(artworks, new Date(), 3), [])
  const gems = useMemo(() => hiddenGems({ viewed: recent.ids }, 4), [recent.ids, shuffleKey])
  const spotlight = useMemo(() => pickForDay(artists), [])
  const spotlightWorks = useMemo(() => artworksByArtist(spotlight.id).slice(0, 3), [spotlight])
  const newest = useMemo(() => artworks.slice(-6).reverse(), [])
  const event = useMemo(() => eventForToday(), [])

  const showMeSomething = useCallback(() => {
    setSurprise(randomArtwork(surprise.id))
    setShuffleKey((key) => key + 1)
  }, [surprise.id])

  /** Random walk: a room, a work, an artist or an exhibition, chosen blind. */
  const takeMeSomewhere = useCallback(() => {
    const routes = [
      () => `/rooms/${rooms[Math.floor(Math.random() * rooms.length)].id}`,
      () => `/artwork/${randomArtwork().id}`,
      () => `/artists/${artists[Math.floor(Math.random() * artists.length)].id}`,
      () => `/exhibitions/${exhibitions[Math.floor(Math.random() * exhibitions.length)].id}`,
    ]
    navigate(routes[Math.floor(Math.random() * routes.length)]())
  }, [navigate])

  return (
    <PageTransition>
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10 lg:py-16">
          <p className="plaque text-[var(--gold)]">{formatDateLong()}</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none">
            Discover
          </h1>
          <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
            For when you do not already know what you are looking for.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={showMeSomething} className="btn btn-solid">
              <Sparkles size={15} strokeWidth={1.5} />
              Show me something
            </button>
            <button type="button" onClick={takeMeSomewhere} className="btn">
              <Shuffle size={15} strokeWidth={1.5} />
              Take me somewhere
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[110rem] px-5 py-14 sm:px-10">
        {/* ------------------------------------------------- the shuffled surprise */}
        <section className="mb-20">
          <SectionHeading title="Featured today" note="Picked at random, then held until you shuffle again." />
          <AnimatePresence mode="wait">
            <motion.div
              key={surprise.id}
              initial={settings.motionEnabled ? { opacity: 0, y: 24, rotate: -0.6 } : false}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={settings.motionEnabled ? { opacity: 0, y: -20, rotate: 0.6 } : undefined}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14"
            >
              <Link to={`/artwork/${surprise.id}`} className="group block">
                <div className="frame-mount p-3 transition-shadow duration-700 ease-gallery group-hover:shadow-[0_32px_66px_-28px_rgba(0,0,0,0.6)]">
                  <SmartImage
                    src={surprise.image}
                    seed={surprise.id}
                    alt={`${surprise.title} by ${surprise.artist}`}
                    eager
                    className="h-72 w-full sm:h-[30rem]"
                    imgClassName="object-cover"
                  />
                </div>
              </Link>
              <div>
                <p className="plaque text-[var(--gold)]">{periodName(surprise.period)}</p>
                <h2 className="mt-3 font-display text-3xl font-light italic sm:text-4xl">
                  {surprise.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">
                  {surprise.artist} · {surprise.yearText}
                </p>
                <p className="mt-5 max-w-reading text-sm leading-[1.85] text-[var(--ink-soft)]">
                  {surprise.description}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to={`/artwork/${surprise.id}`} className="btn">
                    Explore this work
                    <ArrowRight size={15} strokeWidth={1.5} />
                  </Link>
                  <button type="button" onClick={showMeSomething} className="btn btn-quiet">
                    <Shuffle size={15} strokeWidth={1.5} />
                    Another
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* --------------------------------------------------------- hidden gems */}
        <section className="mb-20">
          <SectionHeading
            title="Hidden gems"
            note="Works nobody puts on a poster."
            to="/artworks"
            linkLabel="Whole collection"
          />
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-10 lg:grid-cols-4">
            {gems.map((item) => (
              <ArtworkFrame key={item.id} artwork={item} height="h-44 sm:h-52" />
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- artist spotlight */}
        <section className="mb-20 border-t border-[var(--rule)] pt-10">
          <div className="grid gap-10 lg:grid-cols-[0.4fr_1fr] lg:gap-14">
            <div>
              <p className="plaque text-[var(--gold)]">Artist spotlight</p>
              <div className="mt-5 max-w-[16rem] border border-[var(--rule)] bg-[var(--mat)] p-2">
                <SmartImage
                  src={spotlight.portrait}
                  seed={spotlight.id}
                  alt={`Portrait of ${spotlight.name}`}
                  className="h-56 w-full"
                  imgClassName="object-cover object-top"
                />
              </div>
            </div>
            <div>
              <h2 className="font-display text-3xl font-light uppercase leading-tight sm:text-4xl">
                {spotlight.name}
              </h2>
              <p className="mt-3 text-xs uppercase tracking-plaque text-[var(--ink-faint)]">
                {spotlight.birth ?? '—'}
                {spotlight.death ? ` — ${spotlight.death}` : ''}
                {spotlight.nationality ? ` · ${spotlight.nationality}` : ''}
              </p>
              <p className="mt-5 max-w-reading text-sm leading-[1.85] text-[var(--ink-soft)]">
                {spotlight.bio}
              </p>
              {spotlightWorks.length ? (
                <div className="mt-8 flex flex-wrap gap-4">
                  {spotlightWorks.map((work) => (
                    <Link key={work.id} to={`/artwork/${work.id}`} className="group">
                      <SmartImage
                        src={work.thumb}
                        seed={work.id}
                        alt={work.title}
                        className="h-28 w-28 border border-[var(--rule)] sm:h-32 sm:w-32"
                        imgClassName="object-cover transition-transform duration-1000 ease-gallery group-hover:scale-[1.05]"
                      />
                    </Link>
                  ))}
                </div>
              ) : null}
              <Link
                to={`/artists/${spotlight.id}`}
                className="link-underline mt-7 inline-block text-xs uppercase tracking-plaque text-[var(--ink-soft)]"
              >
                The full profile
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ on this day */}
        <section className="mb-20 border-t border-[var(--rule)] pt-10">
          <p className="plaque text-[var(--gold)]">On this day</p>
          <p className="mt-5 max-w-3xl font-display text-2xl font-light leading-snug sm:text-3xl">
            {event.year < 0 ? `${Math.abs(event.year)} BCE` : event.year} — {event.label}
          </p>
          <Link
            to="/timeline"
            className="link-underline mt-5 inline-block text-xs uppercase tracking-plaque text-[var(--ink-soft)]"
          >
            See the {event.periodName} period
          </Link>
        </section>

        {/* ----------------------------------------------------------- recently added */}
        <section>
          <SectionHeading
            title="Recently added"
            note="The newest entries in the catalogue."
            to="/artworks"
          />
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-10 lg:grid-cols-6">
            {newest.map((item) => (
              <ArtworkFrame key={item.id} artwork={item} height="h-36 sm:h-44" />
            ))}
          </div>
        </section>

        {/* Keep the daily featured selection reachable even after shuffling */}
        <p className="mt-16 border-t border-[var(--rule)] pt-6 text-xs text-[var(--ink-faint)]">
          Today's selection for everyone:{' '}
          <Link to={`/artwork/${featured.id}`} className="link-underline">
            {featured.title}
          </Link>
          , {featured.artist}
          {artworksById[featured.id]?.yearText ? `, ${featured.yearText}` : ''}.
        </p>
      </div>
    </PageTransition>
  )
}
