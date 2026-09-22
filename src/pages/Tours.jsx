import { Link } from 'react-router-dom'
import { Play, Shuffle } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { SmartImage } from '../components/artwork/SmartImage'
import { tours } from '../data/tours'
import { artworksById, artworks } from '../data/artworks'
import { useMuseumProgress } from '../context/MuseumProvider'

export default function Tours() {
  const { progress } = useMuseumProgress()

  return (
    <PageTransition>
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10 lg:py-16">
          <p className="plaque text-[var(--gold)]">Guided</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none">
            Tours
          </h1>
          <p className="mt-5 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
            A route through the building with someone else choosing the order. Each stop holds for
            about nine seconds; pause, step back or leave whenever you like.
          </p>
          {progress.toursCompleted ? (
            <p className="mt-4 text-xs uppercase tracking-plaque text-[var(--ink-faint)]">
              {progress.toursCompleted} completed
            </p>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-10">
        <ul className="grid gap-10 lg:grid-cols-2">
          {tours.map((tour) => {
            const first = artworksById[tour.stops[0]?.id]
            return (
              <li key={tour.id} className="border-t border-[var(--rule)] pt-6">
                <div className="flex gap-5">
                  <div className="frame-mount shrink-0 p-2">
                    <SmartImage
                      src={first?.thumb}
                      seed={first?.id ?? tour.id}
                      alt=""
                      className="h-28 w-24 sm:h-36 sm:w-32"
                      imgClassName="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display text-2xl font-light">{tour.name}</h2>
                    <p className="mt-1 text-xs uppercase tracking-plaque text-[var(--ink-faint)]">
                      {tour.length}
                    </p>
                    <p className="mt-3 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
                      {tour.description}
                    </p>
                    <Link to={`/tours/${tour.id}`} className="btn mt-5">
                      <Play size={14} strokeWidth={1.5} />
                      Start guided tour
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}

          {/* ------------------------------------------------------- random route */}
          <li className="border-t border-[var(--rule)] pt-6">
            <div className="flex gap-5">
              <div className="flex h-28 w-24 shrink-0 items-center justify-center border border-dashed border-[var(--rule)] sm:h-36 sm:w-32">
                <Shuffle size={22} strokeWidth={1} className="text-[var(--ink-faint)]" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-light">Random tour</h2>
                <p className="mt-1 text-xs uppercase tracking-plaque text-[var(--ink-faint)]">
                  6 stops · drawn fresh each time
                </p>
                <p className="mt-3 max-w-reading text-sm leading-relaxed text-[var(--ink-soft)]">
                  Six works pulled at random from all {artworks.length} in the collection. No theme,
                  no argument, no order.
                </p>
                <Link to="/tours/random" className="btn mt-5">
                  <Play size={14} strokeWidth={1.5} />
                  Start random tour
                </Link>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </PageTransition>
  )
}
