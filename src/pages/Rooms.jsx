import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { SmartImage } from '../components/artwork/SmartImage'
import { MuseumMap } from '../components/museum/MuseumMap'
import { Reveal } from '../components/ui/Reveal'
import { rooms } from '../data/rooms'
import { artworksById } from '../data/artworks'
import { useMuseumProgress } from '../context/MuseumProvider'

export default function Rooms() {
  const { progress } = useMuseumProgress()

  return (
    <PageTransition kind="slide">
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-14 sm:px-10 lg:py-20">
          <p className="plaque text-[var(--gold)]">The building</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none">
            Rooms
          </h1>
          <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
            Nine rooms, arranged roughly by period and then by temperament. Each one is hung under
            its own light. Rooms you have already walked through carry a stamp.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[110rem] px-5 py-14 sm:px-10">
        <MuseumMap />

        <ul className="mt-20 space-y-14">
          {rooms.map((room, index) => {
            const featured = artworksById[room.featured]
            const visited = progress.visitedRooms.includes(room.id)
            const flip = index % 2 === 1

            return (
              <li key={room.id}>
                <Reveal delay={0.04}>
                  <Link
                    to={`/rooms/${room.id}`}
                    className={`group grid gap-7 border-t border-[var(--rule)] pt-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 ${
                      flip ? 'lg:[direction:rtl]' : ''
                    }`}
                  >
                    <div className="[direction:ltr]">
                      <div className="flex items-baseline gap-4">
                        <span className="font-display text-4xl font-light text-[var(--ink-faint)]">
                          {room.number}
                        </span>
                        {visited ? (
                          <span className="inline-flex items-center gap-1.5 border border-[var(--gold)]/40 px-2 py-0.5 text-[0.62rem] uppercase tracking-plaque text-[var(--gold)]">
                            <Check size={11} strokeWidth={2} />
                            Visited
                          </span>
                        ) : null}
                      </div>
                      <h2 className="mt-3 font-display text-3xl font-light sm:text-4xl">{room.name}</h2>
                      <p className="mt-2 text-sm italic text-[var(--ink-soft)]">{room.subtitle}</p>
                      <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
                        {room.description}
                      </p>
                      <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 text-xs sm:grid-cols-3">
                        <div>
                          <dt className="plaque text-[var(--ink-faint)]">Period</dt>
                          <dd className="mt-1 text-[var(--ink-soft)]">{room.periodLabel}</dd>
                        </div>
                        <div>
                          <dt className="plaque text-[var(--ink-faint)]">Works</dt>
                          <dd className="mt-1 text-[var(--ink-soft)]">{room.count}</dd>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <dt className="plaque text-[var(--ink-faint)]">Light</dt>
                          <dd className="mt-1 text-[var(--ink-soft)]">{room.atmosphere.mood}</dd>
                        </div>
                      </dl>
                      <span className="link-underline mt-7 inline-block text-xs uppercase tracking-plaque text-[var(--ink-soft)]">
                        Enter room {room.number}
                      </span>
                    </div>

                    <div className="[direction:ltr]">
                      <div
                        className="frame-mount p-3 transition-shadow duration-700 ease-gallery group-hover:shadow-[0_32px_66px_-28px_rgba(0,0,0,0.6)]"
                        style={{ backgroundColor: room.atmosphere.wall }}
                      >
                        <SmartImage
                          src={featured?.thumb}
                          seed={featured?.id ?? room.id}
                          alt={featured ? `${featured.title} by ${featured.artist}` : room.name}
                          className="h-56 w-full sm:h-80"
                          imgClassName="object-cover transition-transform duration-[1400ms] ease-gallery group-hover:scale-[1.03]"
                        />
                      </div>
                      {featured ? (
                        <p className="mt-3 text-xs text-[var(--ink-faint)]">
                          Featured: {featured.title}, {featured.artist}, {featured.yearText}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </PageTransition>
  )
}
