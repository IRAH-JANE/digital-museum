import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Compass, Heart, Search, Shuffle } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ArtworkFrame } from '../components/artwork/ArtworkFrame'
import { SmartImage } from '../components/artwork/SmartImage'
import { MuseumMap } from '../components/museum/MuseumMap'
import { artworks, artworksById } from '../data/artworks'
import { artists } from '../data/artists'
import { rooms } from '../data/rooms'
import { exhibitions } from '../data/exhibitions'
import { periodName } from '../data/periods'
import { pickForDay, pickForHour, formatDateLong } from '../utils/dateUtils'
import { recommendFor, randomArtwork } from '../utils/recommendations'
import { useMuseum } from '../context/MuseumProvider'

function Stat({ value, label }) {
  return (
    <div className="border-t border-[var(--rule)] pt-3">
      <p className="font-display text-3xl font-light leading-none">{value}</p>
      <p className="mt-1.5 text-xs uppercase tracking-plaque text-[var(--ink-faint)]">{label}</p>
    </div>
  )
}

export default function Museum() {
  const navigate = useNavigate()
  const { recent, favorites, progress, setSearchOpen } = useMuseum()

  const daily = useMemo(() => pickForDay(artworks), [])
  const hourly = useMemo(() => pickForHour(artworks), [])
  const exhibition = useMemo(() => pickForDay(exhibitions), [])
  const cover = artworksById[exhibition.coverId]

  const recommended = useMemo(
    () => recommendFor({ favorites: favorites.ids, viewed: recent.ids }, 4),
    [favorites.ids, recent.ids],
  )

  const unvisited = useMemo(
    () => rooms.filter((room) => !progress.progress.visitedRooms.includes(room.id)).slice(0, 3),
    [progress.progress.visitedRooms],
  )

  const returning = progress.stats.artworks > 0
  const continueWork = recent.items[0] ?? daily

  return (
    <PageTransition kind="reveal">
      {/* ---------------------------------------------------------------- lobby */}
      <section className="relative overflow-hidden border-b border-[var(--rule)]">
        <div className="mx-auto grid max-w-[110rem] gap-10 px-5 py-14 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:py-20">
          <div>
            <p className="plaque text-[var(--gold)]">
              {returning ? 'Welcome back' : 'The entrance hall'}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,6vw,5rem)] font-light leading-[0.95]">
              {returning ? 'Continue your journey.' : 'Take your time.'}
            </h1>
            <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
              {returning
                ? `You have looked at ${progress.stats.artworks} ${
                    progress.stats.artworks === 1 ? 'work' : 'works'
                  } so far. The building is open, the rooms are quiet, and nothing here is in a hurry.`
                : 'Nine rooms, four centuries and a few things made this morning. Walk in any direction — nothing needs to be seen in order.'}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/rooms" className="btn btn-solid">
                <Compass size={15} strokeWidth={1.5} />
                Explore the rooms
              </Link>
              <Link to="/collection" className="btn">
                <Heart size={15} strokeWidth={1.5} />
                My collection
              </Link>
              <button type="button" onClick={() => setSearchOpen(true)} className="btn">
                <Search size={15} strokeWidth={1.5} />
                Search
              </button>
              <button
                type="button"
                onClick={() => navigate(`/artwork/${randomArtwork().id}`)}
                className="btn btn-quiet"
              >
                <Shuffle size={15} strokeWidth={1.5} />
                Take me somewhere
              </button>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <Stat value={artworks.length} label="Works" />
              <Stat value={artists.length} label="Artists" />
              <Stat value={rooms.length} label="Rooms" />
              <Stat value={exhibitions.length} label="Exhibitions" />
            </div>
          </div>

          {/* The hallway view: the current exhibition, hung at the far end */}
          <Link to={`/exhibitions/${exhibition.id}`} className="group block">
            <div className="frame-mount relative p-3 transition-shadow duration-700 ease-gallery group-hover:shadow-[0_34px_70px_-28px_rgba(0,0,0,0.65)]">
              <SmartImage
                src={cover?.image}
                seed={cover?.id}
                alt={cover ? `${cover.title} by ${cover.artist}` : exhibition.title}
                eager
                className="h-[22rem] w-full sm:h-[30rem]"
                imgClassName="object-cover transition-transform duration-[1400ms] ease-gallery group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-5 flex items-end justify-between gap-6 border-t border-[var(--rule)] pt-4">
              <div>
                <p className="plaque text-[var(--ink-faint)]">Now showing</p>
                <p className="mt-2 font-display text-2xl font-light">{exhibition.title}</p>
                <p className="mt-1 text-sm italic text-[var(--ink-soft)]">{exhibition.tagline}</p>
              </div>
              <span className="link-underline shrink-0 pb-1 text-xs uppercase tracking-plaque text-[var(--ink-soft)]">
                Enter
              </span>
            </div>
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-[110rem] px-5 py-16 sm:px-10">
        {/* ------------------------------------------------- continue exploring */}
        <section className="mb-20">
          <SectionHeading
            title={returning ? 'Continue exploring' : 'Begin here'}
            note={returning ? 'Where you left off.' : 'A good first work to stand in front of.'}
          />
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Link to={`/artwork/${continueWork.id}`} className="group block">
              <div className="frame-mount p-3 transition-shadow duration-700 ease-gallery group-hover:shadow-[0_30px_64px_-26px_rgba(0,0,0,0.6)]">
                <SmartImage
                  src={continueWork.image}
                  seed={continueWork.id}
                  alt={`${continueWork.title} by ${continueWork.artist}`}
                  className="h-[20rem] w-full sm:h-[28rem]"
                  imgClassName="object-cover"
                />
              </div>
            </Link>
            <div>
              <p className="plaque text-[var(--gold)]">{periodName(continueWork.period)}</p>
              <h3 className="mt-3 font-display text-3xl font-light italic sm:text-4xl">
                {continueWork.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                {continueWork.artist} · {continueWork.yearText}
              </p>
              <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
                {continueWork.description}
              </p>
              <Link to={`/artwork/${continueWork.id}`} className="btn mt-7">
                Continue exploring
                <ArrowRight size={15} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ recently viewed */}
        {recent.items.length > 1 ? (
          <section className="mb-20">
            <SectionHeading
              title="Recently viewed"
              note="The last rooms you stood in."
              to="/collection"
              linkLabel="All of it"
            />
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {recent.items.slice(0, 5).map((item) => (
                <ArtworkFrame key={item.id} artwork={item} height="h-40 sm:h-48" />
              ))}
            </div>
          </section>
        ) : null}

        {/* -------------------------------------------- today's work and the hour */}
        <section className="mb-20 grid gap-10 lg:grid-cols-2">
          {[
            { label: "Today's artwork", note: formatDateLong(), item: daily },
            { label: 'Artwork of the hour', note: 'Changes on the hour.', item: hourly },
          ].map(({ label, note, item }) => (
            <div key={label} className="border-t border-[var(--rule)] pt-6">
              <p className="plaque text-[var(--ink-faint)]">{label}</p>
              <p className="mt-1 text-xs text-[var(--ink-faint)]">{note}</p>
              <Link to={`/artwork/${item.id}`} className="group mt-6 flex gap-5">
                <div className="frame-mount shrink-0 p-2">
                  <SmartImage
                    src={item.thumb}
                    seed={item.id}
                    alt=""
                    className="h-32 w-28 sm:h-40 sm:w-36"
                    imgClassName="object-cover transition-transform duration-1000 ease-gallery group-hover:scale-[1.04]"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xl italic leading-snug">{item.title}</p>
                  <p className="mt-1 text-xs text-[var(--ink-soft)]">
                    {item.artist} · {item.yearText}
                  </p>
                  <p className="mt-3 line-clamp-4 text-xs leading-relaxed text-[var(--ink-soft)]">
                    {item.description}
                  </p>
                  <span className="link-underline mt-3 inline-block text-xs uppercase tracking-plaque text-[var(--ink-soft)]">
                    Explore this work
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </section>

        {/* ------------------------------------------------------- recommendations */}
        <section className="mb-20">
          <SectionHeading
            title={favorites.count ? 'Because of what you saved' : 'Recommended'}
            note="Matched on artist, period, medium and subject."
            to="/discover"
            linkLabel="Discover"
          />
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {recommended.map((item) => (
              <ArtworkFrame key={item.id} artwork={item} height="h-44 sm:h-52" />
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- rooms and progress */}
        <section className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading
              title={unvisited.length ? "Rooms you haven't visited" : 'Every room visited'}
              note={
                unvisited.length
                  ? 'Three doors still closed.'
                  : 'You have walked the whole building. Go back to a favourite.'
              }
              to="/rooms"
              linkLabel="Floor plan"
            />
            <ul className="space-y-0">
              {(unvisited.length ? unvisited : rooms.slice(0, 3)).map((room) => (
                <li key={room.id}>
                  <Link
                    to={`/rooms/${room.id}`}
                    className="group flex items-baseline gap-5 border-b border-[var(--rule)] py-4"
                  >
                    <span className="font-display text-2xl font-light text-[var(--ink-faint)]">
                      {room.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-xl">{room.name}</span>
                      <span className="block truncate text-xs text-[var(--ink-soft)]">
                        {room.subtitle}
                      </span>
                    </span>
                    <ArrowRight
                      size={15}
                      strokeWidth={1.5}
                      className="shrink-0 text-[var(--ink-faint)] transition-transform duration-500 ease-gallery group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading
              title="Your museum progress"
              note="Kept in this browser, nowhere else."
              to="/journey"
              linkLabel="Full journey"
            />
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <Stat value={progress.stats.artworks} label="Works seen" />
              <Stat value={progress.stats.artists} label="Artists" />
              <Stat value={`${progress.stats.rooms}/${progress.stats.totalRooms}`} label="Rooms" />
              <Stat value={progress.stats.achievements} label="Earned" />
            </div>
            <motion.div className="mt-8" initial={false}>
              <MuseumMap compact />
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}
